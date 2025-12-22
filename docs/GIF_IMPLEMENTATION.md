# GIF Implementation Guide (v1.3.0)

Technical documentation for implementing GIF output format in Snake Evolution.

> **Status:** Planned for v1.3.0 (January 2025)
> **Research date:** December 22, 2025

## Overview

GIF output enables:

1. **Glass theme** - Pre-rendered blur effects (too heavy for SVG)
2. **Email embedding** - Works in email clients unlike SVG
3. **Universal compatibility** - Every platform supports GIF

## Architecture

```
┌─────────────────┐
│  SnakeFrame[]   │  Simulation output
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ renderStaticSVG │  Generate SVG for each frame
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  @resvg/resvg-js│  Rust/WASM SVG → RGBA pixels
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     gifenc      │  Pure JS GIF encoder
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Buffer (GIF)  │  Final output
└─────────────────┘
```

## Dependencies

Install in `packages/renderer`:

```bash
bun add @resvg/resvg-js gifenc
```

| Package | Version | Size | Notes |
|---------|---------|------|-------|
| `@resvg/resvg-js` | ^2.6.2 | ~3MB | Rust/WASM, Bun compatible since 0.8.1 |
| `gifenc` | ^1.0.3 | 9KB | Pure JS, no deps |

## Implementation

### Core Function

**File:** `packages/renderer/src/gif.ts`

```typescript
import { Resvg } from "@resvg/resvg-js";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import type { SnakeFrame, RenderOptions } from "@snake-evolution/types";
import { renderStaticSVG } from "./index";

interface GifOptions extends Partial<RenderOptions> {
  width?: number;
  height?: number;
  frameDelay?: number;
  loop?: boolean;
  onProgress?: (current: number, total: number) => void;
}

export async function renderAnimatedGIF(
  frames: SnakeFrame[],
  options: GifOptions = {}
): Promise<Buffer> {
  const {
    width = 847,
    height = 112,
    frameDelay = 150,
    loop = true,
    onProgress,
    ...renderOptions
  } = options;

  const gif = GIFEncoder();
  const total = frames.length;

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];

    // Progress callback
    if (onProgress) onProgress(i + 1, total);

    // 1. Render static SVG for this frame
    const svg = renderStaticSVG(frame.grid, frame.snake, renderOptions);

    // 2. Convert SVG to RGBA pixels using resvg (WASM)
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: width },
    });
    const rendered = resvg.render();
    const pixels = rendered.pixels; // Uint8Array RGBA

    // 3. Quantize colors (GIF max 256)
    const palette = quantize(pixels, 256, { format: "rgba4444" });
    const indexed = applyPalette(pixels, palette, "rgba4444");

    // 4. Add frame to GIF
    gif.writeFrame(indexed, width, height, {
      palette,
      delay: frameDelay,
      dispose: 2, // restore to background
    });
  }

  gif.finish();
  return Buffer.from(gif.bytes());
}
```

### Frame Sampling (Optimization)

For animations with many frames, sample to reduce file size:

```typescript
export async function renderAnimatedGIFSampled(
  frames: SnakeFrame[],
  options: GifOptions & { sampleRate?: number } = {}
): Promise<Buffer> {
  const { sampleRate = 1, ...gifOptions } = options;

  if (sampleRate <= 1) {
    return renderAnimatedGIF(frames, gifOptions);
  }

  // Sample every Nth frame, adjust delay accordingly
  const sampled = frames.filter((_, i) => i % sampleRate === 0);
  const adjustedDelay = (gifOptions.frameDelay || 150) * sampleRate;

  return renderAnimatedGIF(sampled, {
    ...gifOptions,
    frameDelay: adjustedDelay,
  });
}
```

### CLI Integration

**File:** `packages/cli/src/index.ts`

```typescript
import { renderAnimatedGIF } from "@snake-evolution/renderer";

// In generate action:
if (options.format === "gif") {
  console.log("🎬 Rendering animated GIF...");

  const gifBuffer = await renderAnimatedGIF(frames, {
    ...renderOptions,
    onProgress: (current, total) => {
      process.stdout.write(`\r   Frame ${current}/${total}`);
    },
  });

  process.stdout.write("\n");
  writeFileSync(outputPath, gifBuffer);
} else {
  // Existing SVG logic
}
```

### Export from Package

**File:** `packages/renderer/src/index.ts`

```typescript
// Add export
export { renderAnimatedGIF, renderAnimatedGIFSampled } from "./gif";
```

## Glass Theme

Glass theme uses blur filters that are expensive in SVG but free in GIF:

```typescript
// packages/cli/src/format.ts
export function validateOutputFormat(format: string, theme: string) {
  if (theme === "glass" && format !== "gif") {
    return {
      ok: false,
      reason: "Glass theme requires GIF format for blur effects.",
      hint: "Use: --format gif --theme glass",
    };
  }
  return { ok: true };
}
```

## Performance Considerations

### File Size

| Frames | Raw GIF | With Sampling (2x) |
|--------|---------|-------------------|
| 100 | ~300 KB | ~150 KB |
| 300 | ~800 KB | ~400 KB |
| 500 | ~1.3 MB | ~650 KB |

### Encoding Speed

- resvg-js: ~50-100 frames/second (WASM)
- gifenc: Very fast (pure JS, optimized)
- Total: ~5-10 seconds for typical animation

### Memory

- Hold one frame in memory at a time
- ~4 bytes per pixel × 847 × 112 = ~380 KB per frame
- GIF encoder streams, doesn't buffer all frames

## Why Not Platane's Approach

| Platane (2021) | Snake Evolution (2025) |
|----------------|------------------------|
| `node-canvas` | `@resvg/resvg-js` |
| Native cairo deps | Pure WASM |
| `gif-encoder-2` | `gifenc` |
| `gifsicle` binary | Not needed |
| Complex setup | `bun add` and done |
| Node.js only | Bun + Node + Edge |

## Testing

```bash
# Generate test GIF
bun run snake generate -u octocat -f gif -o test.gif -t github-dark

# Verify output
file test.gif  # Should show "GIF image data, version 89a"

# Test Glass theme
bun run snake generate -u octocat -f gif -o glass.gif -t glass

# Run unit tests
bun test packages/renderer/src/gif.test.ts
```

## Bun 1.3.5 Features

Relevant features for GIF implementation:

| Feature | Use |
|---------|-----|
| WASM support | resvg-js runs natively |
| Buffer API | GIF output handling |
| `Bun.stringWidth` | Progress bar (future) |
| S3 client | Store GIFs in cloud (API) |

## References

- [resvg-js on npm](https://www.npmjs.com/package/@resvg/resvg-js)
- [gifenc on GitHub](https://github.com/mattdesl/gifenc)
- [Bun 1.3.5 release notes](https://bun.sh/blog/bun-v1.3.5)
