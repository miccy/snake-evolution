# Architecture

> Technical architecture documentation for Snake Evolution

## Overview

Snake Evolution is a monorepo project that transforms GitHub contribution graphs into animated snake visualizations.

## Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Runtime | Bun | JavaScript runtime with native SQLite |
| Monorepo | Turborepo | Build system and task orchestration |
| Web | Astro + Starlight | Website and documentation |
| UI | React 19 | Interactive components |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Database | Evolu | Local-first with CRDT sync |
| API | ElysiaJS | Type-safe API server |
| Linting | Biome | Lint and format |
| Types | TypeScript 5.9 | Type safety |

## Project Structure

```
snake-evolution/
├── apps/
│   ├── web/                # Astro + Starlight unified app
│   └── api/                # ElysiaJS API server
├── packages/
│   ├── types/              # Shared TypeScript types
│   ├── ui/                 # Shared React components
│   ├── engine/             # Snake game logic
│   ├── renderer/           # SVG/GIF rendering
│   ├── github/             # GitHub API client
│   ├── biome-config/       # Shared Biome config
│   └── typescript-config/  # Shared TS configs
├── docker/                 # Docker setup
└── docs/                   # Technical documentation
```

## Data Flow

```
GitHub API → packages/github → packages/engine → packages/renderer → Output (SVG/GIF)
                                     ↓
                              Evolu (local-first storage)
```

## Key Concepts

### Local-First Architecture

Using Evolu for local-first data storage with:

- Offline capability
- End-to-end encryption
- CRDT-based conflict resolution
- Cross-device sync

### Snake Engine

The snake engine implements:

- A* pathfinding algorithm
- Growth mechanics based on contribution intensity
- Animation frame generation

---

*This document is auto-imported into Starlight at `/docs` route.*
