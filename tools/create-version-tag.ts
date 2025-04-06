#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Creates a git tag with the current package version and a 'v' prefix,
 * but only if it doesn't already exist.
 */
function main() {
    try {
        // Read the current version from package.json
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const version = packageJson.version;
        
        if (!version) {
            console.error('Error: Could not find version in package.json');
            process.exit(1);
        }

        // Format the tag with 'v' prefix
        const tagName = `v${version}`;
        
        // Check if the tag already exists
        try {
            // This command will throw an error if the tag doesn't exist
            execSync(`git rev-parse ${tagName}`, { stdio: 'pipe' });
            console.log(`Tag ${tagName} already exists. Skipping tag creation.`);
        } catch (error) {
            // Tag doesn't exist, so create it
            console.log(`Creating git tag: ${tagName}`);
            execSync(`git tag ${tagName}`);
            console.log(`Successfully created tag: ${tagName}`);
            
            // Optional: Push the tag to remote
            const shouldPush = process.argv.includes('--push');
            if (shouldPush) {
                console.log('Pushing tag to remote...');
                execSync(`git push origin ${tagName}`);
                console.log(`Successfully pushed tag: ${tagName}`);
            } else {
                console.log('To push this tag to remote, run: git push origin ' + tagName);
                console.log('Or run this script with --push flag: pnpm vtag --push');
            }
        }
    } catch (error) {
        console.error('Error creating version tag:', error);
        process.exit(1);
    }
}

// Run the script
main();
