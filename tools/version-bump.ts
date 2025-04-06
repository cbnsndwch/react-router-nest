#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { sync as syncGlob } from 'glob';

type VersionPart = 'major' | 'minor' | 'patch';

// Check if a string is a valid semver version (e.g., 1.2.3)
const isValidSemVer = (version: string): boolean => {
  // Simple semver regex pattern: major.minor.patch
  // This supports basic semver like 1.2.3 but not pre-release or build metadata
  return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version);
};

// Get the current root version
function readRootVersion(): string {
    const rootPackageJson = path.join(process.cwd(), 'package.json');
    const rootPkg = JSON.parse(fs.readFileSync(rootPackageJson, 'utf-8'));
    return rootPkg.version;
}

// Calculate the new version based on the bump type
function getNewVersion(currentVersion: string, bumpType?: VersionPart): string {
    if (!bumpType) {
        return currentVersion; // Just return current version if no bump type (for the version command)
    }

    const [major, minor, patch] = currentVersion.split('.').map(Number);

    switch (bumpType) {
        case 'major':
            return `${major + 1}.0.0`;
        case 'minor':
            return `${major}.${minor + 1}.0`;
        case 'patch':
            return `${major}.${minor}.${patch + 1}`;
        default:
            return currentVersion;
    }
}

// Get all package.json files in the workspace
function getPackageJsonFiles(): string[] {
    // Include the root package.json and all package.json files in workspaces
    // Exclude node_modules directories
    const filesInWorkspaces = syncGlob('{apps,libs,packages}/**/package.json', {
        ignore: ['**/node_modules/**']
    });
    return ['package.json', ...filesInWorkspaces];
}

// Update the version in a package.json file
function updatePackageVersion(filePath: string, newVersion: string): void {
    const packagePath = path.join(process.cwd(), filePath);

    // Skip if the file doesn't exist
    if (!fs.existsSync(packagePath)) {
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

    // Only update if the package has a version field
    if ('version' in packageJson) {
        const oldVersion = packageJson.version;
        packageJson.version = newVersion;

        // Write the updated package.json
        fs.writeFileSync(
            packagePath,
            JSON.stringify(packageJson, null, 4) + '\n'
        );

        console.log(`Updated ${filePath}: ${oldVersion} -> ${newVersion}`);
    }
}

// Main function
function main() {
    // Get the argument from command line
    const arg = process.argv[2];
    const validBumpTypes: VersionPart[] = ['major', 'minor', 'patch'];
    
    // Get the current version from the root package.json
    const currentVersion = readRootVersion();
    
    // If no argument provided, just display current version
    if (!arg) {
        console.log(`Current version: ${currentVersion}`);
        return;
    }
    
    let newVersion: string;
    let displayMessage: string;
    
    // Check if the argument is a specific version
    if (isValidSemVer(arg)) {
        newVersion = arg;
        displayMessage = `Setting version: ${currentVersion} -> ${newVersion}`;
    } 
    // Check if it's a valid bump type
    else if (validBumpTypes.includes(arg as VersionPart)) {
        const bumpType = arg as VersionPart;
        newVersion = getNewVersion(currentVersion, bumpType);
        displayMessage = `Bumping version: ${currentVersion} -> ${newVersion} (${bumpType})`;
    } 
    // Invalid argument
    else {
        console.error(
            `Invalid argument: ${arg}. Must be either a valid semver (e.g., 1.2.3) or one of: ${validBumpTypes.join(', ')}`
        );
        process.exit(1);
    }
    
    console.log(displayMessage);

    // Get all package.json files
    const packageJsonFiles = getPackageJsonFiles();

    // Update all package.json files
    packageJsonFiles.forEach(file => {
        updatePackageVersion(file, newVersion);
    });

    console.log(
        `\nSuccessfully updated ${packageJsonFiles.length} package(s) to version ${newVersion}`
    );
}

// Run the script
main();
