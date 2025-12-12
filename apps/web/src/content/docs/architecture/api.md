---
title: API Reference
description: Snake Evolution API endpoints and usage.
---

# API Reference

The Snake Evolution API is built with ElysiaJS.

## Base URL

```
Production: https://api.snake-evolution.dev
Local:      http://localhost:3001
```

## Endpoints

### Health Check

```http
GET /api/v1/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-12-12T10:00:00.000Z"
}
```

### Generate Snake

```http
POST /api/v1/generate
```

**Request Body:**

```json
{
  "username": "octocat",
  "year": 2024,
  "palette": "github",
  "format": "svg",
  "animated": false
}
```

**Response:**

```json
{
  "jobId": "abc123",
  "status": "pending"
}
```

### Get Job Status

```http
GET /api/v1/job/:id
```

**Response:**

```json
{
  "jobId": "abc123",
  "status": "completed",
  "url": "https://cdn.snake-evolution.dev/abc123.svg"
}
```

## Authentication

Public endpoints don't require authentication.

For higher rate limits, include a token:

```http
Authorization: Bearer YOUR_API_KEY
```

## Rate Limits

| Tier | Requests/min |
|------|--------------|
| Public | 10 |
| Authenticated | 100 |
| Premium | Unlimited |

## Error Responses

```json
{
  "error": "User not found",
  "code": "USER_NOT_FOUND",
  "status": 404
}
```

## SDK Usage

### TypeScript

```typescript
import { SnakeClient } from "@snake-evolution/client";

const client = new SnakeClient();

const result = await client.generate({
  username: "octocat",
  palette: "ocean",
});

console.log(result.url);
```

### cURL

```bash
curl -X POST https://api.snake-evolution.dev/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"username": "octocat"}'
```

## Swagger Documentation

Interactive API docs available at:

```
http://localhost:3001/swagger
```
