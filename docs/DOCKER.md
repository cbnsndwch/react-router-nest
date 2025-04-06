# Docker Image Guidelines

This document outlines the Docker build strategy for the React Router Nest application.

## Multi-Architecture Support

Our Docker images are built and published with support for multiple architectures:

- `linux/amd64` (x86_64) - For standard x86-based servers
- `linux/arm64` (aarch64) - For ARM-based servers, including AWS Graviton, Apple Silicon, and many cloud ARM instances

This multi-architecture approach eliminates the need for emulation and provides native performance on all supported platforms.

## Build Process

The Docker images are built automatically through GitHub Actions when a new version tag is pushed:

1. The workflow in `.github/workflows/release-tag.yml` is triggered on tag push matching `v*.*.*` pattern
2. The Docker Buildx action builds the images for multiple platforms
3. Images are pushed to GitHub Container Registry (ghcr.io)

## Image Tags

- `ghcr.io/cbnsndwch/react-router-nest-server:latest` - Latest stable release
- `ghcr.io/cbnsndwch/react-router-nest-server:v{x.y.z}` - Specific version (e.g., `v0.4.6`)

## Local Multi-Architecture Builds

If you need to build multi-architecture images locally:

```bash
# Set up Docker Buildx builder
docker buildx create --name multiarch --use

# Build and push
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/cbnsndwch/react-router-nest-server:local \
  -f apps/server/Dockerfile \
  --push \
  .
```

## Deployment

For information about deploying these images in a Docker Swarm environment, see the [Docker Stack documentation](../.docker/README.md).

## Best Practices

1. **Base image selection**: We use the official Node Alpine images as they provide a good balance between size and functionality.
2. **Multi-stage builds**: Our Dockerfile uses multi-stage builds to keep the final image small.
3. **Layer caching**: We organize commands to maximize Docker layer caching.
4. **Security**: We run the application as a non-root user where possible.
5. **Metadata**: We apply appropriate OCI-compliant labels to our images.
