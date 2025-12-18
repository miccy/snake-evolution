# Architecture

> Technical architecture documentation for Snake Evolution

## Overview

Snake Evolution is a monorepo project that transforms GitHub contribution graphs into animated snake visualizations.

> ⚠️ **Note:** This document describes both current implementation and planned architecture. Items marked with 🚧 are not yet implemented.

## Tech Stack

| Category | Technology | Status | Purpose |
|----------|------------|--------|---------|
| Runtime | Bun | ✅ | JavaScript runtime |
| Monorepo | Turborepo | ✅ | Build system and task orchestration |
| CLI | Commander | ✅ | Command-line interface |
| Linting | Biome | ✅ | Lint and format |
| Types | TypeScript 5.9 | ✅ | Type safety |
| Web | Astro + Starlight | 🚧 | Website and documentation |
| UI | React 19 | 🚧 | Interactive components |
| Styling | Tailwind CSS 4 | 🚧 | Utility-first CSS |
| Database | Evolu | 🚧 | Local-first with CRDT sync |
| API | ElysiaJS | 🚧 | Type-safe API server |
| Backend | Appwrite | 🚧 | Backend-as-a-Service |

## Project Structure

```
snake-evolution/
├── apps/
│   ├── web/                # 🚧 Astro + Starlight (scaffolded)
│   ├── api/                # 🚧 ElysiaJS API server (scaffolded)
│   └── docs/               # 🚧 Documentation site
├── packages/
│   ├── types/              # ✅ Shared TypeScript types
│   ├── ui/                 # 🚧 Shared React components
│   ├── engine/             # ✅ Snake game logic
│   ├── renderer/           # ✅ SVG rendering
│   ├── github/             # ✅ GitHub API client
│   ├── cli/                # ✅ Command-line interface
│   ├── biome-config/       # ✅ Shared Biome config
│   └── typescript-config/  # ✅ Shared TS configs
├── docker/                 # 🚧 Docker setup
└── docs/                   # Technical documentation
```

## Current Data Flow (v1.0)

```
GitHub API → packages/github → packages/engine → packages/renderer → SVG Output
```

## Planned Data Flow (v2.0+)

```
GitHub API → packages/github → packages/engine → packages/renderer → Output (SVG/GIF)
                                     ↓
                              Evolu (local-first storage)
                                     ↓
                              Appwrite (sync & multiplayer)
```

## Key Concepts

### Snake Engine (✅ Implemented)

The snake engine implements:

- Priority-based pathfinding (hunts high-value contributions first)
- Growth mechanics based on contribution intensity
- Animation frame generation

### Local-First Architecture (🚧 Planned)

Using Evolu for local-first data storage with:

- Offline capability
- End-to-end encryption
- CRDT-based conflict resolution
- Cross-device sync

---

*See [ROADMAP.md](./ROADMAP.md) for implementation timeline.*
