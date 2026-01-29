# @snake-evolution/engine

Core simulation engine for the Snake Evolution project. Implements pathfinding and game logic for the snake animation.

## Features

- 🐍 **Snake Simulation** – Create and control snake movement
- 🎯 **Pathfinding** – BFS algorithm prioritizing high-value contributions
- 🔄 **Frame Generation** – Produces animation frames for the renderer

## Installation

```bash
bun add @snake-evolution/engine
```

## Usage

```typescript
import { simulateSnake, createSnake, moveSnake } from '@snake-evolution/engine';
import type { ContributionGrid } from '@snake-evolution/types';

// Run complete simulation
const frames = simulateSnake(contributionGrid, {
  startPosition: { x: 0, y: 3 },
  maxLength: 10,
  growEvery: 4,
  maxSteps: 2000,
  frameMode: 'every'
});

// Or control manually
const snake = createSnake({ x: 0, y: 3 });
const movedSnake = moveSnake(snake, 'right');
```

## API

| Function | Description |
|----------|-------------|
| `simulateSnake(grid, options)` | Run complete snake simulation |
| `createSnake(position)` | Initialize snake at position |
| `moveSnake(snake, direction)` | Move snake one step |
| `growSnake(snake, count)` | Grow snake by N segments |
| `findNextDirection(grid, snake)` | Get optimal next move |
| `hasContribution(grid, pos)` | Check if cell has contribution |
| `eatContribution(grid, pos)` | Mark contribution as eaten |

## Related Packages

- [`@snake-evolution/types`](../types) – Shared TypeScript types
- [`@snake-evolution/renderer`](../renderer) – SVG/GIF rendering
- [`@snake-evolution/github`](../github) – GitHub API client
