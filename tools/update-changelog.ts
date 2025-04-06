#!/usr/bin/env tsx
/**
 * Conventional Changelog Generator
 * 
 * This script generates a CHANGELOG.md file following the Conventional Changelog format:
 * https://github.com/conventional-changelog/conventional-changelog
 * 
 * The format follows:
 * - An optional header section with project information
 * - An [Unreleased] section for changes not yet in a release
 * - Versioned release sections with commit history organized by type:
 *   - Features (feat:)
 *   - Bug Fixes (fix:)
 *   - Breaking Changes (BREAKING CHANGE: or feat!:)
 *   - Other categories (docs:, style:, refactor:, perf:, test:, etc.)
 * 
 * Each section includes links to GitHub comparisons and commit hashes.
 */

import * as fs from 'fs';
import { execSync } from 'child_process';

// Constants
const CHANGELOG_FILE = 'CHANGELOG.md';
const TEMP_FILE = 'CHANGELOG.temp.md';
const TAG_PREFIX = 'v';

/**
 * Extract the header and unreleased section from existing changelog
 * @returns Object containing header and unreleased content
 */
function extractExistingContent(): { header: string; unreleased: string } {
  if (!fs.existsSync(CHANGELOG_FILE)) {
    return { header: '', unreleased: '' };
  }
  
  const content = fs.readFileSync(CHANGELOG_FILE, 'utf8');
  
  // Extract header (everything before the first version section)
  const headerMatch = content.match(/^([\s\S]*?)## \[/);
  const header = headerMatch ? headerMatch[1].trim() : '';
  
  // Extract unreleased section
  const unreleasedMatch = content.match(/## \[Unreleased\]([\s\S]*?)(?:## \[(?:\d|v\d)|$)/);
  const unreleased = unreleasedMatch 
    ? '## [Unreleased]' + unreleasedMatch[1].trimEnd() 
    : '';
  
  return { header, unreleased };
}

/**
 * Generate CHANGELOG content using conventional-changelog
 * @returns Generated changelog content
 */
function generateChangelog(): string {
  console.log('Generating conventional changelog...');
  
  try {
    // Use the Angular preset with all releases and tag prefix
    execSync(`npx conventional-changelog -p angular -o ${TEMP_FILE} -r 0 -t ${TAG_PREFIX}`, { 
      stdio: ['ignore', 'ignore', 'inherit'] 
    });
    
    if (fs.existsSync(TEMP_FILE)) {
      const content = fs.readFileSync(TEMP_FILE, 'utf8');
      fs.unlinkSync(TEMP_FILE);
      return content;
    }
    
    throw new Error('Failed to generate changelog content');
  } catch (error) {
    console.error('Error generating changelog:', error);
    if (fs.existsSync(TEMP_FILE)) {
      fs.unlinkSync(TEMP_FILE);
    }
    throw error;
  }
}

/**
 * Create a default header if none exists
 * @returns Default header text
 */
function createDefaultHeader(): string {
  return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).`;
}

/**
 * Create a default unreleased section if none exists
 * @returns Default unreleased section
 */
function createDefaultUnreleased(): string {
  return '## [Unreleased]\n\n_No unreleased changes yet._';
}

/**
 * Main function to update the changelog
 */
async function updateChangelog() {
  try {
    // Create backup of existing changelog
    if (fs.existsSync(CHANGELOG_FILE)) {
      fs.copyFileSync(CHANGELOG_FILE, `${CHANGELOG_FILE}.bak`);
    }
    
    // Extract existing content
    let { header, unreleased } = extractExistingContent();
    
    // Use defaults if sections are empty
    if (!header) {
      header = createDefaultHeader();
    }
    
    if (!unreleased) {
      unreleased = createDefaultUnreleased();
    }
    
    // Generate conventional changelog content
    const generated = generateChangelog();
    
    // Combine the content
    let finalContent = `${header}\n\n${unreleased}\n\n${generated.trim()}`;
    
    // Clean up any excessive newlines
    finalContent = finalContent.replace(/\n{3,}/g, '\n\n');
    
    // Write the final content
    fs.writeFileSync(CHANGELOG_FILE, finalContent);
    
    console.log('CHANGELOG.md updated successfully!');
    
    // Remove backup on success
    if (fs.existsSync(`${CHANGELOG_FILE}.bak`)) {
      fs.unlinkSync(`${CHANGELOG_FILE}.bak`);
    }
  } catch (error) {
    console.error('Error updating changelog:', error);
    
    // Restore from backup if available
    if (fs.existsSync(`${CHANGELOG_FILE}.bak`)) {
      fs.copyFileSync(`${CHANGELOG_FILE}.bak`, CHANGELOG_FILE);
      console.log('Restored CHANGELOG.md from backup');
    }
    
    process.exit(1);
  }
}

// Run the updater
updateChangelog();
