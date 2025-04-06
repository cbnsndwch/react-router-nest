# Contributing Guidelines

Thank you for your interest in contributing to the project!

## How to Contribute

- Fork the repository and create a new branch for your feature or bugfix.
- Ensure your code follows our code style and linting rules.
- Write clear commit messages and include tests for new features or fixes.
- For major changes, please open an issue to discuss them before proceeding.

## Code Style

- Follow the conventions enforced by ESLint and Prettier.
- Run `pnpm lint` to check your code.

## Pull Request Process

- Open a pull request with a description of your changes.
- Link any related issues.
- Be prepared to receive feedback and make revisions as needed.
- The CI/CD pipeline will automatically run tests on your changes.

## CI/CD Workflows

This project uses GitHub Actions for continuous integration and deployment:

- Tests are automatically run on pull requests and tagged releases
- Docker images are built and published for tagged releases that follow semantic versioning (v*.*.*)
- Make sure your code passes all tests locally before pushing

For more details about the CI/CD workflows, see [WORKFLOWS.md](.github/WORKFLOWS.md).

## Reporting Issues

- Use GitHub Issues to report bugs or request features.
- Provide as many details as possible, including reproduction steps.

Thank you for helping improve the project!
