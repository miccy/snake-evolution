---
title: Architecture Overview
description: Technical architecture of Snake Evolution.
---

# Architecture Overview

Snake Evolution is built as a modern TypeScript monorepo.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun 1.3+ |
| Monorepo | Turborepo |
| Web | Astro 5 + Starlight |
| API | ElysiaJS |
| Database | Evolu (local-first) |
| Linting | Biome |

## Project Structure

```
snake-evolution/
├── apps/
│   ├── web/              # Astro + Starlight
│   └── api/              # ElysiaJS server
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── engine/           # Snake game logic
│   ├── renderer/         # SVG/GIF rendering
│   ├── github/           # GitHub API client
│   └── ui/               # React components
└── docker/               # Docker setup
```

## Data Flow

```
GitHub API
    ↓
packages/github (fetch contributions)
    ↓
packages/engine (calculate snake path)
    ↓
packages/renderer (generate SVG/GIF)
    ↓
Output file or API response
```

## Key Components

### Snake Engine

The engine calculates the optimal path for the snake:

1. **Pathfinding** - A* algorithm to find nearest contribution
2. **Movement** - Handle snake growth and direction changes
3. **Frame Generation** - Create animation frames

### Renderer

Supports multiple output formats:

- **SVG** - Vector graphics, scales perfectly
- **GIF** - Animated, compatible everywhere
- **PNG** - Static image for embedding

### GitHub Client

Fetches contribution data via:

1. **GraphQL API** - Authenticated, full history
2. **Public Scraping** - Fallback for public profiles

## Local-First with Evolu

User preferences and history stored locally:

- No account required
- Works offline
- End-to-end encrypted sync (optional)
- CRDT for conflict resolution
