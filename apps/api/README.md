# Snake Evolution API

REST API for generating GitHub contribution snake animations on-demand.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Elysia](https://elysiajs.com/)
- **Documentation**: Swagger/OpenAPI

## Development

```bash
# Start development server
bun dev

# Or run directly
bun run src/index.ts
```

The API runs on `http://localhost:3001` with Swagger docs at `/swagger`.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API info |
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/generate` | Queue snake generation |
| `GET` | `/api/v1/job/:id` | Check job status |

## Example Request

```bash
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"username": "octocat", "theme": "github"}'
```

## Response

```json
{
  "message": "Generation queued",
  "jobId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `GITHUB_TOKEN` | GitHub API token (optional) | – |

## Related

- [`apps/web`](../web) – Web frontend
- [`docker/`](../../docker) – Docker development stack
