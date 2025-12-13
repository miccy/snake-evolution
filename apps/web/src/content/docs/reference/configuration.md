---
title: Configuration
description: Configuration options for Snake Evolution.
---

# Configuration

Reference for all configuration options.

## Environment Variables

### API Server

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `3001` |
| `HOST` | API server host | `localhost` |
| `NODE_ENV` | Environment | `development` |

### GitHub

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_TOKEN` | GitHub API token | - |
| `GITHUB_API_URL` | GitHub API URL | `https://api.github.com` |

### Appwrite

| Variable | Description | Default |
|----------|-------------|---------|
| `APPWRITE_ENDPOINT` | Appwrite endpoint | `http://localhost/v1` |
| `APPWRITE_PROJECT_ID` | Project ID | - |
| `APPWRITE_API_KEY` | API key | - |

### Redis

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |

## Configuration Files

### biome.json

Linting and formatting configuration.

### turbo.json

Turborepo pipeline configuration.

### tsconfig.json

TypeScript compiler options.

## Package Configuration

Each package can be configured via its `package.json`:

```json
{
  "name": "@snake-evolution/engine",
  "config": {
    "maxSnakeLength": 100,
    "pathfindingAlgorithm": "astar"
  }
}
```
