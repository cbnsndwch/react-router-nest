# Docker Swarm Stack

This directory contains a Docker Swarm stack configuration for deploying the React Router Nest application.

## Stack File

The main configuration file is `stack.yml`, which defines:

- A service for the React Router Nest server
- Network configuration for integration with an external proxy network
- Environment variable configurations
- Optional resource limits, health checks, and volumes (commented out by default)

## Deployment

### Prerequisites

- Docker Swarm cluster
- Nginx Proxy Manager (or similar reverse proxy) for TLS termination
- External Docker network named "proxy"

### Environment Variables

The stack uses the following environment variables:

- `TAG`: The image version tag (defaults to "latest")
- `DOMAIN`: The domain name for the application (defaults to "localhost")
- `HOST_PORT`: The host port to expose the application on (defaults to 3030)
- Additional optional variables (commented out) for DB connections, secrets, etc.

### Deploying the Stack

1. **Set environment variables (optional)**

   Create a `.env` file in the same directory as your docker-compose.yml:

   ```
   TAG=v0.4.6
   DOMAIN=app.example.com
   HOST_PORT=3030
   ```

2. **Deploy via Docker CLI**

   ```bash
   docker stack deploy -c .docker/stack.yml react-router-nest
   ```

3. **Deploy via Portainer**

   - Navigate to Stacks in Portainer
   - Create a new stack
   - Upload or paste the contents of `stack.yml`
   - Set your environment variables
   - Deploy the stack

## Updating

To update the stack:

```bash
# Pull the latest image
docker pull ghcr.io/cbnsndwch/react-router-nest-server:${TAG}

# Redeploy the stack
docker stack deploy -c .docker/stack.yml react-router-nest
```

## Scaling

To scale the service:

```bash
docker service scale react-router-nest_server=3
```

## Monitoring

Check the status of your services:

```bash
docker service ls
docker service ps react-router-nest_server
docker service logs react-router-nest_server
```
