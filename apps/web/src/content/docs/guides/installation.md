---
title: Installation
description: Set up Snake Evolution for local development.
---

This guide covers setting up Snake Evolution for local development.

## Prerequisites

- [Bun](https://bun.sh) >= 1.3.0
- [Node.js](https://nodejs.org) >= 22 (optional, for compatibility)
- [Docker](https://docker.com) (optional, for backend services)
- [Git](https://git-scm.com)

## Clone the Repository

```bash
git clone https://github.com/miccy/snake-evolution.git
cd snake-evolution
```

## Install Dependencies

```bash
bun install
```

## Start Development

```bash
# Start all services
bun run dev

# Start specific app
bun run dev:web   # Docs site at localhost:4321
bun run dev:api   # API at localhost:3001
```

## Optional: Start Backend Services

If you need Appwrite for file storage:

```bash
docker compose -f docker/docker-compose.yml up -d
```

This starts:

- **Appwrite** at `http://localhost` (Console)
- **Redis** at `localhost:6379`
- **MailDev** at `http://localhost:1080` (Email testing)

## Project Structure

```text
snake-evolution/
├── apps/
│   ├── web/          # Astro + Starlight docs
│   └── api/          # ElysiaJS API server
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── engine/       # Snake game logic
│   ├── renderer/     # SVG rendering (GIF planned)
│   ├── github/       # GitHub API client
│   └── ui/           # Shared React components
└── docker/           # Docker setup
```

## Verify Installation

```bash
# Run all quality checks (lint + typecheck)
bun run check

# Or run tests too
bun run check && bun run test
```

## Troubleshooting

### Bun installation issues

```bash
curl -fsSL https://bun.sh/install | bash
```

### Port already in use

```bash
# Find and kill process on port 4321
lsof -i :4321 | grep LISTEN | awk '{print $2}' | xargs kill
```
