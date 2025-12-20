// Snake Evolution - SVG/GIF Renderer

import type {
  ColorPalette,
  ContributionGrid,
  RenderOptions,
  SnakeFrame,
  SnakeState,
} from "@snake-evolution/types";
import type { GlassTheme } from "./themes";
import { getGlassFilterDefs, getTheme, isGlassTheme, themes } from "./themes";

// Re-export themes
export { getTheme, isGlassTheme, themes };
export type { GlassTheme };

// ============================================
// Rendering Constants
// ============================================

const DEFAULT_OPTIONS: RenderOptions = {
  width: 53,
  height: 7,
  cellSize: 11,
  gap: 3,
  palette: themes["github-dark"] as ColorPalette,
  animated: true,
  frameDelay: 150, // ms per frame - slower for better visibility
};

// ============================================
// Static SVG Rendering (single frame)
// ============================================

export function renderStaticSVG(
  grid: ContributionGrid,
  snake: SnakeState,
  options: Partial<RenderOptions> = {},
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { cellSize, gap, palette } = opts;
  const totalWidth = opts.width * (cellSize + gap) + gap;
  const totalHeight = opts.height * (cellSize + gap) + gap;

  const isGlass = isGlassTheme(palette);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`;

  // Glass theme filters
  if (isGlass) {
    svg += getGlassFilterDefs(palette as GlassTheme);
  }

  // Background
  if (palette.background !== "transparent") {
    svg += `<rect width="${totalWidth}" height="${totalHeight}" fill="${palette.background}" rx="6"/>`;
  }

  // Grid cells
  for (let x = 0; x < grid.weeks.length && x < opts.width; x++) {
    const week = grid.weeks[x];
    for (let y = 0; y < week.length && y < opts.height; y++) {
      const day = week[y];
      const cellX = gap + x * (cellSize + gap);
      const cellY = gap + y * (cellSize + gap);
      const color =
        day.count === 0
          ? palette.empty
          : palette.levels[Math.min(day.level - 1, 3)] || palette.levels[0];

      const filterAttr = isGlass ? ' filter="url(#glass-blur)"' : "";
      svg += `<rect x="${cellX}" y="${cellY}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2"${filterAttr}/>`;
    }
  }

  // Snake
  renderSnakeSegments(svg, snake, opts);

  svg += "</svg>";
  return svg;
}

function renderSnakeSegments(svgRef: string, snake: SnakeState, opts: RenderOptions): string {
  const { cellSize, gap, palette } = opts;
  let svg = svgRef;

  snake.segments.forEach((segment, i) => {
    const cellX = gap + segment.x * (cellSize + gap);
    const cellY = gap + segment.y * (cellSize + gap);

    let color: string;
    if (i === 0) {
      color = palette.snake.head;
    } else if (i === snake.segments.length - 1) {
      color = palette.snake.tail;
    } else {
      color = palette.snake.body;
    }

    const isGlass = isGlassTheme(palette);
    const filterAttr = isGlass ? ' filter="url(#glass-glow)"' : "";
    svg += `<rect x="${cellX}" y="${cellY}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2"${filterAttr}/>`;
  });

  return svg;
}

// ============================================
// Animated SVG Rendering (SMIL animations - like Platane)
// ============================================

export interface AnimatedRenderOptions extends Partial<RenderOptions> {
  /** Total animation duration in seconds */
  duration?: number;
  /** Whether to loop the animation */
  loop?: boolean;
}

export function renderAnimatedSVG(
  frames: SnakeFrame[],
  options: AnimatedRenderOptions = {},
): string {
  if (frames.length === 0) return "";

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { cellSize, gap, palette } = opts;

  // Duration in seconds derived from provided duration or frame delay (fallback 60ms)
  const frameDurationMs =
    options.duration !== undefined && options.duration !== null
      ? (options.duration * 1000) / frames.length
      : opts.frameDelay ?? 60;
  const totalDurationS = (frames.length * frameDurationMs) / 1000;
  const loop = options.loop ?? true;

  const totalWidth = opts.width * (cellSize + gap) + gap;
  const totalHeight = opts.height * (cellSize + gap) + gap;
  const isGlass = isGlassTheme(palette);

  // Helper to convert grid position to pixel position (center of cell)
  const toPixel = (gridPos: number) => gap + gridPos * (cellSize + gap);

  // Track which cells get eaten and at what time
  const eatenCells = new Map<string, number>(); // "x,y" -> frame index
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    if (frame.eatenPosition) {
      const key = `${frame.eatenPosition.x},${frame.eatenPosition.y}`;
      if (!eatenCells.has(key)) {
        eatenCells.set(key, i);
      }
    }
  }

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`;

  // Glass filters
  if (isGlass) {
    svg += getGlassFilterDefs(palette as GlassTheme);
  }

  // Background
  if (palette.background !== "transparent") {
    svg += `<rect width="${totalWidth}" height="${totalHeight}" fill="${palette.background}" rx="6"/>`;
  }

  // Grid cells with eat animations (NO repeat - cells stay eaten)
  const initialGrid = frames[0].grid;
  for (let x = 0; x < initialGrid.weeks.length && x < opts.width; x++) {
    const week = initialGrid.weeks[x];
    for (let y = 0; y < week.length && y < opts.height; y++) {
      const day = week[y];
      const cellX = toPixel(x);
      const cellY = toPixel(y);

      const color =
        day.count === 0
          ? palette.empty
          : palette.levels[Math.min(day.level - 1, 3)] || palette.levels[0];

      const filterAttr = isGlass ? ' filter="url(#glass-blur)"' : "";
      const key = `${x},${y}`;

      if (eatenCells.has(key)) {
        // This cell will be eaten - build animation with proper timing
        const eatFrame = eatenCells.get(key)!;
        const eatPercent = eatFrame / frames.length;

        // Build keyTimes and values for the entire animation
        // Before eat: show original color, after eat: show empty
        const beforeEat = Math.max(0, eatPercent - 0.001).toFixed(4);
        const atEat = eatPercent.toFixed(4);

        svg += `<rect x="${cellX}" y="${cellY}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2"${filterAttr}>`;
        svg += `<animate attributeName="fill" `;
        svg += `values="${color};${color};${palette.empty};${palette.empty}" `;
        svg += `keyTimes="0;${beforeEat};${atEat};1" `;
        svg += `dur="${totalDurationS.toFixed(2)}s" repeatCount="${loop ? "indefinite" : "1"}" fill="freeze"/>`;
        svg += `</rect>`;
      } else {
        svg += `<rect x="${cellX}" y="${cellY}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2"${filterAttr}/>`;
      }
    }
  }

  // Snake segments with visual gradient (Platane style)
  // Head is larger, body segments decrease toward tail, opacity fades
  const maxSnakeLength = Math.max(...frames.map((f) => f.snake.segments.length));

  for (let segIdx = 0; segIdx < maxSnakeLength; segIdx++) {
    // Build position arrays for this segment across all frames
    const xPositions: number[] = [];
    const yPositions: number[] = [];
    const opacities: number[] = [];
    const sizes: number[] = [];
    const keyTimes: string[] = [];

    for (let fi = 0; fi < frames.length; fi++) {
      const frame = frames[fi];
      const segment = frame.snake.segments[segIdx];
      const keyTime =
        fi === 0 ? "0" : fi === frames.length - 1 ? "1" : (fi / (frames.length - 1)).toFixed(4);
      keyTimes.push(keyTime);

      if (segment) {
        const snakeLen = frame.snake.segments.length;
        // Calculate visual properties based on position in snake
        const positionRatio = segIdx / Math.max(1, snakeLen - 1); // 0 = head, 1 = tail

        // Size: head is 1.3x, tail is 0.7x
        const sizeMultiplier = segIdx === 0 ? 1.3 : 1.0 - positionRatio * 0.3;
        const segSize = Math.round(cellSize * sizeMultiplier);
        const offset = (cellSize - segSize) / 2;

        xPositions.push(toPixel(segment.x) + offset);
        yPositions.push(toPixel(segment.y) + offset);
        sizes.push(segSize);

        // Opacity: head is 1, fades to 0.5 at tail
        const opacity = segIdx === 0 ? 1 : 1 - positionRatio * 0.5;
        opacities.push(Number(opacity.toFixed(2)));
      } else {
        // Segment doesn't exist yet - hide it completely
        // Use same position as last known or start, but with 0 size to hide
        xPositions.push(xPositions.length > 0 ? xPositions[xPositions.length - 1] : toPixel(0));
        yPositions.push(yPositions.length > 0 ? yPositions[yPositions.length - 1] : toPixel(3));
        sizes.push(0); // Size 0 = invisible
        opacities.push(0);
      }
    }

    const filterAttr = isGlass ? ' filter="url(#glass-glow)"' : "";
    const repeatCount = loop ? "indefinite" : "1";

    // Skip segments that never appear in any frame
    const everVisible = opacities.some((o) => o > 0);
    if (!everVisible) continue;

    // Determine color for this segment
    let segmentColor: string;
    if (segIdx === 0) {
      segmentColor = palette.snake.head;
    } else if (segIdx >= maxSnakeLength - 2) {
      segmentColor = palette.snake.tail;
    } else {
      segmentColor = palette.snake.body;
    }

    // Find first frame where segment exists
    const firstVisibleIdx = opacities.findIndex((o) => o > 0);
    const initX = xPositions[firstVisibleIdx] ?? xPositions[0];
    const initY = yPositions[firstVisibleIdx] ?? yPositions[0];
    const initSize = sizes[firstVisibleIdx] ?? 0;
    const initOpacity = 0; // Start hidden, animation will show it

    // Use rounded rect with variable size
    const rx = segIdx === 0 ? 4 : 2; // Head more rounded

    svg += `<rect x="${initX}" y="${initY}" width="${initSize}" height="${initSize}" fill="${segmentColor}" rx="${rx}" opacity="${initOpacity}"${filterAttr}>`;

    // Position animations
    svg += `<animate attributeName="x" values="${xPositions.join(";")}" keyTimes="${keyTimes.join(";")}" dur="${totalDurationS.toFixed(2)}s" repeatCount="${repeatCount}" calcMode="linear"/>`;
    svg += `<animate attributeName="y" values="${yPositions.join(";")}" keyTimes="${keyTimes.join(";")}" dur="${totalDurationS.toFixed(2)}s" repeatCount="${repeatCount}" calcMode="linear"/>`;

    // Size animation
    svg += `<animate attributeName="width" values="${sizes.join(";")}" keyTimes="${keyTimes.join(";")}" dur="${totalDurationS.toFixed(2)}s" repeatCount="${repeatCount}" calcMode="discrete"/>`;
    svg += `<animate attributeName="height" values="${sizes.join(";")}" keyTimes="${keyTimes.join(";")}" dur="${totalDurationS.toFixed(2)}s" repeatCount="${repeatCount}" calcMode="discrete"/>`;

    // Opacity animation - DISCRETE so segments appear/disappear instantly
    svg += `<animate attributeName="opacity" values="${opacities.join(";")}" keyTimes="${keyTimes.join(";")}" dur="${totalDurationS.toFixed(2)}s" repeatCount="${repeatCount}" calcMode="discrete"/>`;

    svg += `</rect>`;
  }

  svg += "</svg>";
  return svg;
}

// ============================================
// Backward Compatibility
// ============================================

/** @deprecated Use renderStaticSVG instead */
export function renderGridSVG(
  grid: ContributionGrid,
  snake: SnakeState,
  options: Partial<RenderOptions> = {},
): string {
  return renderStaticSVG(grid, snake, options);
}

// ============================================
// Exports
// ============================================

export type { ColorPalette, RenderOptions, SnakeFrame };
