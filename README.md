# @cbnsndwch/react-router-nest

[![Release Pipeline](https://github.com/cbnsndwch/react-router-nest/actions/workflows/release-tag.yml/badge.svg)](https://github.com/cbnsndwch/react-router-nest/actions/workflows/release-tag.yml)

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

### Docker Deployment

The project includes Docker support with multi-architecture images (amd64/arm64):

- Docker images are published to GitHub Container Registry: `ghcr.io/cbnsndwch/react-router-nest-server`
- A Docker Swarm stack configuration is available in `.docker/stack.yml`

For more information:
- See [Docker Image Guidelines](docs/DOCKER.md) for details on the Docker images
- See [Docker Stack Documentation](.docker/README.md) for deployment instructions

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
