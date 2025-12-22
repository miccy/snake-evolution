# @snake-evolution/renderer

SVG renderer for Snake Evolution. Generates static and animated SVG images from simulation frames.

## Features

- 🖼️ **Static SVG** – Single-frame renders
- 🎬 **Animated SVG** – SMIL-based animations (like Platane's original)
- 🎨 **Theming** – Multiple color palettes (GitHub, Ocean, Synthwave, CypherPunk)
- ⚡ **Performant** – Optimized for GitHub profile embedding

## Installation

```bash
bun add @snake-evolution/renderer
```

## Usage

```typescript
import { renderStaticSVG, renderAnimatedSVG } from '@snake-evolution/renderer';
import { simulateSnake } from '@snake-evolution/engine';

// Static render
const staticSvg = renderStaticSVG(grid, snake, {
  cellSize: 12,
  gap: 2,
  palette: 'github'
});

// Animated render
const frames = simulateSnake(grid);
const animatedSvg = renderAnimatedSVG(frames, {
  loop: true,
  duration: 5000
});
```

## API

| Function | Description |
|----------|-------------|
| `renderStaticSVG(grid, snake, options)` | Render single frame |
| `renderAnimatedSVG(frames, options)` | Render animated SVG |
| `renderGridSVG(grid, snake, options)` | ⚠️ Deprecated – use `renderStaticSVG` |

## Available Themes

| Theme | Description |
|-------|-------------|
| `github` | Classic GitHub green |
| `ocean` | Blue ocean waves |
| `synthwave` | Retro neon purple/pink |
| `cypherpunk` | Blue/magenta cyberpunk |
| `glass` | Glassmorphism (GIF only, v1.1+) |

## Related Packages

- [`@snake-evolution/engine`](../engine) – Simulation engine
- [`@snake-evolution/types`](../types) – Shared TypeScript types
