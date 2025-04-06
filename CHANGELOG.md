# Changelog

## [v0.4.4] - 2025-04-06

### CI/CD Improvements
- Added comprehensive GitHub Actions workflows documentation
- Enhanced CI/CD process structure and reliability
- Fixed GitHub workflow for tags that was failing due to missing jsdom dependency

### File Changes

#### Added
- `.github/WORKFLOWS.md` - New documentation for GitHub workflows

#### Modified
- `.github/actions/setup-node-pnpm/action.yml` - Improved Node.js and pnpm setup action
- `.github/actions/test-report/action.yml` - Enhanced test reporting action
- `.github/actions/validate-semver-tag/action.yml` - Added proper semver tag validation
- `.github/workflows/reusable-docker-build.yml` - Updated Docker build workflow
- `.github/workflows/reusable-test.yml` - Fixed test workflow with jsdom support
- `CONTRIBUTING.md` - Updated with CI/CD workflow information
- `README.md` - Updated badge to point to correct workflow
- `apps/server/package.json` - Added jsdom dependency for Vitest DOM testing
- `package.json` - Version bump to 0.4.4

### Commits
- e9dacc0 feat: bump version to 0.4.4 and add jsdom dependency [cbnsndwch]
- 8f17d2e feat: add comprehensive GitHub Actions workflows documentation and improve CI/CD processes [cbnsndwch]

## [v0.4.3] (Previous release)

Please see the git history for changes prior to v0.4.4.
