#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// File names and paths
const CHANGELOG_FILE = 'CHANGELOG.md';
const TEMP_CHANGELOG_FILE = 'changelog-generated.md';

/**
 * Execute a command and return its output
 * @param command Command to execute
 * @returns Command output
 */
function exec(command: string): string {
  return execSync(command, { encoding: 'utf8' }).trim();
}

/**
 * Generate the conventional changelog
 */
function generateConventionalChangelog(): void {
  console.log('Generating conventional changelog...');
  // This seems to miss some tags - use -r 0 for latest
  execSync(`npx conventional-changelog -p angular -o ${TEMP_CHANGELOG_FILE} -r 0`);
}

/**
 * Extract header from changelog
 * @param content Changelog content
 * @returns Header text
 */
function extractHeader(content: string): string {
  const headerMatches = content.match(/^([\s\S]*?)(?:## \[\d|\[v\d|## \[Unreleased\])/);
  return headerMatches ? headerMatches[1].trim() : '';
}

/**
 * Extract unreleased section from changelog
 * @param content Changelog content
 * @returns Unreleased section text
 */
function extractUnreleasedSection(content: string): string {
  const unreleasedMatches = content.match(/## \[Unreleased\]([\s\S]*?)(?:## \[\d|## \[v\d|$)/);
  return unreleasedMatches ? '## [Unreleased]' + unreleasedMatches[1].trimEnd() : '';
}

/**
 * Get git tags sorted by version
 */
function getGitTags(): string[] {
  const tags = exec('git tag -l').split('\n').filter(Boolean);
  return tags.sort((a, b) => {
    const aVersion = a.replace('v', '').split('.').map(Number);
    const bVersion = b.replace('v', '').split('.').map(Number);
    
    for (let i = 0; i < Math.max(aVersion.length, bVersion.length); i++) {
      const aVal = aVersion[i] || 0;
      const bVal = bVersion[i] || 0;
      if (aVal !== bVal) {
        return bVal - aVal; // Descending order (newest first)
      }
    }
    
    return 0;
  });
}

/**
 * Get commit messages between tags
 */
function getCommitsBetweenTags(startTag: string, endTag: string): { hash: string; message: string }[] {
  const range = startTag ? `${startTag}..${endTag}` : endTag;
  const output = exec(`git log ${range} --pretty=format:"%h|%s" --no-merges`);
  if (!output) return [];
  
  return output.split('\n').map(line => {
    const [hash, ...messageParts] = line.split('|');
    return { hash, message: messageParts.join('|') };
  });
}

/**
 * Create a v0.4.4 changelog entry since it seems to be missing
 */
function createV044Entry(): string {
  // Get v0.4.4 date
  const tagDate = exec('git log -1 --format=%ad --date=short v0.4.4');
  
  // Get commits between v0.4.3 and v0.4.4
  const commits = getCommitsBetweenTags('v0.4.3', 'v0.4.4')
    .filter(commit => {
      // Filter out merge commits and non-conventional commits
      const message = commit.message;
      return !message.startsWith('Merge') && 
             (message.startsWith('feat') || 
              message.startsWith('fix') || 
              message.startsWith('docs') ||
              message.startsWith('style') ||
              message.startsWith('refactor') ||
              message.startsWith('perf') ||
              message.startsWith('test') ||
              message.startsWith('build') ||
              message.startsWith('ci') ||
              message.startsWith('chore'));
    });
  
  // Group commits by type
  const types: Record<string, { hash: string; message: string }[]> = {};
  
  for (const commit of commits) {
    const match = commit.message.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.*)/);
    if (match) {
      const [, type] = match;
      if (!types[type]) {
        types[type] = [];
      }
      types[type].push(commit);
    }
  }
  
  // Build the changelog entry
  let entry = `## [v0.4.4](https://github.com/cbnsndwch/react-router-nest/compare/v0.4.3...v0.4.4) (${tagDate})\n\n`;
  
  // Features first
  if (types.feat && types.feat.length > 0) {
    entry += '### Features\n\n';
    for (const commit of types.feat) {
      const message = commit.message.replace(/^feat(?:\([^)]+\))?:\s*/, '');
      entry += `* ${message} ([${commit.hash}](https://github.com/cbnsndwch/react-router-nest/commit/${commit.hash}))\n`;
    }
    entry += '\n';
  }
  
  // Then fixes
  if (types.fix && types.fix.length > 0) {
    entry += '### Bug Fixes\n\n';
    for (const commit of types.fix) {
      const message = commit.message.replace(/^fix(?:\([^)]+\))?:\s*/, '');
      entry += `* ${message} ([${commit.hash}](https://github.com/cbnsndwch/react-router-nest/commit/${commit.hash}))\n`;
    }
    entry += '\n';
  }
  
  return entry;
}

/**
 * Combine changelog parts with proper spacing
 * @param header Header text
 * @param unreleased Unreleased section text
 * @param v044Section v0.4.4 section text
 * @param generated Generated changelog content
 * @returns Combined changelog
 */
function combineChangelog(header: string, unreleased: string, v044Section: string, generated: string): string {
  let newChangelog = header ? header + '\n\n' : '';
  
  if (unreleased) {
    newChangelog += unreleased + '\n\n';
  }
  
  if (v044Section) {
    newChangelog += v044Section;
  }
  
  // Add the generated changelog with proper spacing
  newChangelog += generated.trim();
  
  // Normalize newlines to prevent excessive blank lines
  return newChangelog.replace(/\n{3,}/g, '\n\n');
}

/**
 * Update changelog file
 */
function updateChangelog(): void {
  try {
    // Generate the new changelog
    generateConventionalChangelog();

    // Read the generated changelog
    const generatedChangelog = fs.readFileSync(TEMP_CHANGELOG_FILE, 'utf8');

    // Read the existing changelog
    const existingChangelog = fs.readFileSync(CHANGELOG_FILE, 'utf8');

    // Extract components
    const header = extractHeader(existingChangelog);
    const unreleased = extractUnreleasedSection(existingChangelog);
    
    // Create v0.4.4 entry
    const v044Section = createV044Entry();

    // Combine the parts
    const newChangelog = combineChangelog(header, unreleased, v044Section, generatedChangelog);

    // Write the combined changelog back to the file
    fs.writeFileSync(CHANGELOG_FILE, newChangelog);

    // Clean up the temporary generated file
    fs.unlinkSync(TEMP_CHANGELOG_FILE);

    console.log('CHANGELOG.md updated successfully!');
  } catch (error) {
    console.error('Error updating changelog:', error);
    process.exit(1);
  }
}

// Run the update
updateChangelog();
