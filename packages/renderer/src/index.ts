// Snake Evolution - SVG/GIF Renderer

import type {
  ColorPalette,
  ContributionGrid,
  RenderOptions,
  SnakeState,
} from "@snake-evolution/types";

// ============================================
// Default Palettes
// ============================================

export const palettes: Record<string, ColorPalette> = {
  github: {
    name: "GitHub",
    background: "#0d1117",
    empty: "#161b22",
    levels: ["#0e4429", "#006d32", "#26a641", "#39d353"],
    snake: {
      head: "#58a6ff",
      body: "#388bfd",
      tail: "#1f6feb",
    },
  },
  ocean: {
    name: "Ocean",
    background: "#0a192f",
    empty: "#112240",
    levels: ["#1e3a5f", "#2d5986", "#3c78ad", "#4b97d4"],
    snake: {
      head: "#64ffda",
      body: "#4cd9c4",
      tail: "#34b3ae",
    },
  },
  sunset: {
    name: "Sunset",
    background: "#1a1a2e",
    empty: "#16213e",
    levels: ["#e94560", "#f27d85", "#f5a5ab", "#f8cdd0"],
    snake: {
      head: "#ffd700",
      body: "#ffb700",
      tail: "#ff9700",
    },
  },
};

// ============================================
// SVG Rendering
// ============================================

export function renderGridSVG(
  grid: ContributionGrid,
  snake: SnakeState,
  options: Partial<RenderOptions> = {},
): string {
  const opts: RenderOptions = {
    width: 53,
    height: 7,
    cellSize: 10,
    gap: 2,
    palette: palettes.github,
    animated: false,
    frameDelay: 100,
    ...options,
  };

  const { cellSize, gap, palette } = opts;
  const totalWidth = opts.width * (cellSize + gap) + gap;
  const totalHeight = opts.height * (cellSize + gap) + gap;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`;

  // Background
  svg += `<rect width="${totalWidth}" height="${totalHeight}" fill="${palette.background}" rx="6"/>`;

  // Grid cells
  for (let x = 0; x < grid.weeks.length; x++) {
    const week = grid.weeks[x];
    for (let y = 0; y < week.length; y++) {
      const day = week[y];
      const cellX = gap + x * (cellSize + gap);
      const cellY = gap + y * (cellSize + gap);
      const color =
        day.count === 0 ? palette.empty : palette.levels[day.level - 1] || palette.levels[0];
      svg += `<rect x="${cellX}" y="${cellY}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2"/>`;
    }
  }

  // Snake
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
    svg += `<rect x="${cellX}" y="${cellY}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2"/>`;
  });

  svg += "</svg>";
  return svg;
}

export function renderAnimatedSVG(
  _frames: Array<{ grid: ContributionGrid; snake: SnakeState }>,
  _options: Partial<RenderOptions> = {},
): string {
  // TODO: Implement animated SVG with CSS animations
  return "";
}

export type { ColorPalette, RenderOptions };
