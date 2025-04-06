# Portainer Stack Redeployment

This repository includes a GitHub Actions workflow that automatically redeploys your Portainer CE stack when you push a new version tag.

## Setup

### Required Secrets

Add these secrets to your GitHub repository:

- `PORTAINER_URL`: The URL to your Portainer instance (e.g., "https://portainer.example.com")
- `PORTAINER_TOKEN`: Your Portainer API token
- `PORTAINER_ENVIRONMENT`: The Docker Swarm environment ID in Portainer
- `PORTAINER_STACK_ID`: The ID of the stack you want to redeploy

### Find Stack and Environment IDs

You can find your stack ID and environment ID using simple API calls:

```bash
# Get all stacks
curl -X GET "https://your-portainer-url/api/stacks" \
  -H "X-API-Key: your-api-key"

# Get all environments
curl -X GET "https://your-portainer-url/api/endpoints" \
  -H "X-API-Key: your-api-key"
```

Alternatively, you can find your stack ID through the Portainer UI by navigating to your stack and looking at the URL:
`https://portainer.example.com/#/stacks/123` (where 123 is your stack ID)

## How It Works

The process is integrated into the existing release workflow (`.github/workflows/release-tag.yml`):

1. When you push a new version tag (v*.*.*)
2. The workflow validates the semver tag
3. Runs tests
4. Builds and pushes the Docker image to GitHub Container Registry
5. **Redeploys your Portainer stack automatically**

## Usage

Simply push a new version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

No additional steps needed - the redeployment happens automatically after your image is built and pushed!

## Implementation Details

The redeployment uses a custom GitHub Action (`.github/actions/portainer-redeploy`) that:

- Makes a PUT request to the Portainer API endpoint `/api/stacks/{id}/redeploy`
- Includes the Docker Swarm environment ID in the request
- Handles errors and provides status feedback
