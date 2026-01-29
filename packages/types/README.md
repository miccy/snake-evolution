# @snake-evolution/types

Shared TypeScript type definitions for the Snake Evolution monorepo.

## Installation

```bash
bun add @snake-evolution/types
```

## Usage

```typescript
import type {
  ContributionGrid,
  GitHubContribution,
  SnakeState,
  SnakeFrame,
  Position,
  Direction,
  ColorPalette,
  RenderOptions
} from '@snake-evolution/types';
```

## Type Categories

### GitHub Types

| Type | Description |
|------|-------------|
| `GitHubContribution` | Single day contribution data |
| `ContributionGrid` | Full year contribution grid |

### Snake Types

| Type | Description |
|------|-------------|
| `Position` | `{ x: number, y: number }` |
| `Direction` | `"up" \| "down" \| "left" \| "right"` |
| `SnakeSegment` | Position + direction |
| `SnakeState` | Complete snake state |

### Simulation Types

| Type | Description |
|------|-------------|
| `SnakeFrame` | Single animation frame |
| `SimulationOptions` | Engine configuration |

### Rendering Types

| Type | Description |
|------|-------------|
| `ColorPalette` | Theme color definitions |
| `RenderOptions` | Renderer configuration |
| `OutputFormat` | `"svg" \| "gif" \| "png"` |

### API Types

| Type | Description |
|------|-------------|
| `GenerationRequest` | API request payload |
| `GenerationResult` | API response payload |
| `ApiResponse<T>` | Generic API wrapper |
| `HealthCheckResponse` | Health endpoint response |

## Related Packages

- [`@snake-evolution/engine`](../engine) – Simulation engine
- [`@snake-evolution/renderer`](../renderer) – SVG/GIF rendering
- [`@snake-evolution/github`](../github) – GitHub API client
