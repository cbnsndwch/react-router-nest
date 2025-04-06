# @cbnsndwch/react-router-nest

[![CI/CD Pipeline](https://github.com/cbnsndwch/react-router-nest/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/cbnsndwch/react-router-nest/actions/workflows/ci-cd.yml)

`React Router 7` x `NestJS` custom server template for `Turbo` + `PNPM` monorepos

## Description

A [Turbo] + [PNPM] monorepo demonstrating how to run [React Router 7] on a [NestJS] custom server. It showcases the integration of React Router 7, a modern React framework for building better websites, with NestJS, a progressive Node.js framework for building efficient and scalable server-side applications.

## Overview

This demo shows how to leverage modern routing and server-side rendering from React Router 7 while keeping the NestJS backend robust and scalable.


## Repository Structure

- apps/
    - server: NestJS custom server integrated with React Router 7
- libs/
    - (empty): Intended location for app-specific libraries

## Getting Started

### Installing

- Clone the repository: `git clone https://github.com/cbnsndwch/react-router-nest.git`
- Navigate to the project directory: `cd react-router-nest`
- Install dependencies: `pnpm i`

### Running in Dev Mode

- Start the server: `cd apps/server && pnpm dev`
- Visit `http://localhost:4003` in your browser to view the application
- Send a GET request to `http://localhost:4003/api/hello` to test the API

## Contributing

We welcome contributions from the community! Please consider the following:
- Follow the code style and linting guidelines.
- Write clear commit messages.
- Include tests for new features or bug fixes.
- Open issues to discuss major changes before implementing them.
- Feel free to open a pull request with improvements.

For more details, check the [CONTRIBUTING.md](CONTRIBUTING.md) if available or contact the maintainers.

## Authors

[Sergio Leon](https://cbnsndwch.io)

## License

This project is licensed under the MIT license. See [LICENSE.md](LICENSE.md) for details.

[React Router 7]: https://reactrouter.com/home
[Turbo]: https://turbo.build/docs
[PNPM]: https://pnpm.io/
[NestJS]: https://docs.nestjs.com/
