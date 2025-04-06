# CI/CD Workflow Architecture

This project uses a modular GitHub Actions workflow system that separates concerns and follows DRY principles.

## Structure Overview

```
.github/
├── actions/              # Reusable composite actions
│   ├── setup-node-pnpm/  # Node.js and pnpm setup
│   ├── test-report/      # Test execution and reporting
│   ├── validate-semver-tag/ # Git tag validation
│   └── docker-metadata/  # Docker tag generation
│
└── workflows/            # GitHub workflow files
    ├── reusable-test.yml      # Reusable test workflow
    ├── reusable-docker-build.yml # Reusable Docker build workflow
    ├── pull-request.yml       # PR workflow
    ├── main-push.yml          # Main branch workflow
    ├── develop-push.yml       # Develop branch workflow
    └── release-tag.yml        # Release tag workflow
```

## Workflow Triggers

- **Pull Requests** (pull-request.yml): Runs on PRs to `main` or `develop`
  - Runs tests
  - Posts test results to PR comments
  - Does not build or push Docker images

- **Main Branch** (main-push.yml): Runs on pushes to `main`
  - Runs tests only
  - Does not build or push Docker images

- **Develop Branch** (develop-push.yml): Runs on pushes to `develop`
  - Runs tests
  - If tests pass, builds and pushes Docker images
  - Tags images with `dev-{sha}` and `dev-latest`

- **Release Tags** (release-tag.yml): Runs on git tags matching `v*.*.*`
  - Validates that the tag is a proper semver tag
  - Runs tests
  - If validation and tests pass, builds and pushes Docker images
  - Tags images with version number and `latest`

## Reusable Components

### Composite Actions

1. **setup-node-pnpm**: Sets up Node.js and pnpm environment
   - Handles Node.js installation based on `package.json`
   - Configures pnpm with dependency caching
   - Installs project dependencies

2. **test-report**: Runs tests and generates reports
   - Builds the application
   - Runs tests with coverage
   - Uploads test results and coverage reports
   - Updates PR with test status (when applicable)

3. **validate-semver-tag**: Validates git tag format
   - Confirms tag starts with 'v' and follows semver format
   - Extracts version number for Docker tagging

4. **docker-metadata**: Configures Docker metadata
   - Generates appropriate tags based on context (develop, release)
   - Handles inclusion of 'latest' tag when applicable

### Reusable Workflows

1. **reusable-test.yml**: Reusable workflow for test execution
   - Uses setup-node-pnpm and test-report actions
   - Configurable test parameters

2. **reusable-docker-build.yml**: Reusable workflow for Docker builds
   - Handles Docker build and push operations
   - Uses docker-metadata for tag generation
   - Configurable build parameters

## Adding New Events

To add a new event trigger, create a new workflow file that:
1. Defines the trigger conditions
2. Sets appropriate permissions
3. Uses the reusable workflows as needed

## Best Practices

- Always use the reusable workflows rather than duplicating steps
- Add new composite actions when you identify reusable patterns
- Maintain consistent naming conventions
- Keep workflow files small and focused on specific event types
