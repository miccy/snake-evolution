import { describe, expect, test } from "bun:test";
import type { ContributionGrid, SnakeFrame, SnakeState } from "@snake-evolution/types";
import { getTheme, renderAnimatedSVG, renderStaticSVG, themes } from "./index";

// ============================================
// Test Fixtures
// ============================================
function createMockGrid(): ContributionGrid {
  const weeks = Array.from({ length: 53 }, () =>
    Array.from({ length: 7 }, () => ({
      date: "2025-01-01",
      count: 0,
      level: 0 as 0 | 1 | 2 | 3 | 4,
    })),
  );

  // Add some contributions
  weeks[5][3] = { date: "2025-01-01", count: 3, level: 2 };
  weeks[10][4] = { date: "2025-01-01", count: 5, level: 4 };

  return {
    username: "test",
    year: 2025,
    totalContributions: 2,
    weeks,
  };
}

function createMockSnake(): SnakeState {
  return {
    segments: [
      { x: 3, y: 3, direction: "right" },
      { x: 2, y: 3, direction: "right" },
      { x: 1, y: 3, direction: "right" },
    ],
    direction: "right",
    length: 3,
    score: 2,
  };
}

function createMockFrames(): SnakeFrame[] {
  const grid = createMockGrid();
  return [
    {
      snake: {
        segments: [{ x: 0, y: 3, direction: "right" }],
        direction: "right",
        length: 1,
        score: 0,
      },
      grid,
      frameIndex: 0,
    },
    {
      snake: {
        segments: [{ x: 1, y: 3, direction: "right" }],
        direction: "right",
        length: 1,
        score: 0,
      },
      grid,
      frameIndex: 1,
    },
    {
      snake: {
        segments: [{ x: 2, y: 3, direction: "right" }],
        direction: "right",
        length: 1,
        score: 0,
      },
      grid,
      frameIndex: 2,
    },
  ];
}

// ============================================
// Theme Tests
// ============================================

describe("Renderer - Themes", () => {
  describe("themes registry", () => {
    test("should have all expected themes", () => {
      expect(themes["github-light"]).toBeDefined();
      expect(themes["github-dark"]).toBeDefined();
      expect(themes.ocean).toBeDefined();
      expect(themes.sunset).toBeDefined();
      expect(themes["neon-gamer"]).toBeDefined();
      expect(themes.cypherpunk).toBeDefined();
    });

    test("each theme should have required properties", () => {
      for (const [_name, theme] of Object.entries(themes)) {
        expect(theme.name).toBeDefined();
        expect(theme.background).toBeDefined();
        expect(theme.empty).toBeDefined();
        expect(theme.levels).toHaveLength(4);
        expect(theme.snake.head).toBeDefined();
        expect(theme.snake.body).toBeDefined();
        expect(theme.snake.tail).toBeDefined();
      }
    });
  });

  describe("getTheme", () => {
    test("should return correct theme by name", () => {
      const theme = getTheme("github-dark");
      expect(theme.name).toBe("GitHub Dark");
    });

    test("should fall back to github-dark for unknown theme", () => {
      const theme = getTheme("unknown-theme");
      expect(theme.name).toBe("GitHub Dark");
    });

    test("should return ocean theme", () => {
      const theme = getTheme("ocean");
      expect(theme.name).toBe("Ocean Deep");
    });

    test("should return cypherpunk theme", () => {
      const theme = getTheme("cypherpunk");
      expect(theme.name).toBe("Cypherpunk");
    });
  });
});

// ============================================
// Static SVG Rendering Tests
// ============================================

describe("Renderer - Static SVG", () => {
  describe("renderStaticSVG", () => {
    test("should return valid SVG string", () => {
      const grid = createMockGrid();
      const snake = createMockSnake();
      const svg = renderStaticSVG(grid, snake);

      expect(svg).toMatch(/^<svg/);
      expect(svg).toMatch(/<\/svg>$/);
    });

    test("should include viewBox attribute", () => {
      const grid = createMockGrid();
      const snake = createMockSnake();
      const svg = renderStaticSVG(grid, snake);

      expect(svg).toContain('viewBox="');
    });

    test("should include background rect", () => {
      const grid = createMockGrid();
      const snake = createMockSnake();
      const svg = renderStaticSVG(grid, snake, { palette: themes["github-dark"] });

      // Check for background element
      expect(svg).toContain("<rect");
    });

    test("should render snake segments with color and position", () => {
      const grid = createMockGrid();
      const snake = createMockSnake();
      const svg = renderStaticSVG(grid, snake);

      const headColor = themes["github-dark"].snake.head;
      const cellSize = 11;
      const gap = 3;
      const headX = gap + snake.segments[0].x * (cellSize + gap);
      const headY = gap + snake.segments[0].y * (cellSize + gap);

      const headRectPattern = new RegExp(
        `<rect[^>]*x="${headX}"[^>]*y="${headY}"[^>]*fill="${headColor}"`,
      );

      expect(svg).toMatch(headRectPattern);
    });

    test("should render grid cells", () => {
      const grid = createMockGrid();
      const snake = createMockSnake();
      const svg = renderStaticSVG(grid, snake);

      // Should have many rect elements for grid
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBeGreaterThan(10);
    });

    test("should use custom palette", () => {
      const grid = createMockGrid();
      const snake = createMockSnake();
      const svg = renderStaticSVG(grid, snake, { palette: themes.ocean });

      // Ocean theme background color
      expect(svg).toContain("#0a192f");
    });
  });
});

// ============================================
// Animated SVG Rendering Tests
// ============================================

describe("Renderer - Animated SVG", () => {
  describe("renderAnimatedSVG", () => {
    test("should return empty string for empty frames", () => {
      const svg = renderAnimatedSVG([]);
      expect(svg).toBe("");
    });

    test("should return valid SVG string", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames);

      expect(svg).toMatch(/^<svg/);
      expect(svg).toMatch(/<\/svg>$/);
    });

    test("should include SMIL animate elements", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames);

      expect(svg).toContain("<animate");
      expect(svg).toContain("attributeName=");
    });

    test("should include position animations", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames);

      expect(svg).toContain('attributeName="x"');
      expect(svg).toContain('attributeName="y"');
    });

    test("should use duration option", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { duration: 10 });

      // Should see 10s or 10.00s in duration
      expect(svg).toMatch(/dur="10(\.00)?s"/);
    });

    test("should derive duration from frameDelay when provided", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { frameDelay: 200 });

      expect(svg).toContain('dur="0.60s"');
    });

    test("should set repeatCount to indefinite by default", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames);

      expect(svg).toContain('repeatCount="indefinite"');
    });

    test("should set repeatCount to 1 when loop is false", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { loop: false });

      expect(svg).toContain('repeatCount="1"');
    });

    test("should include opacity animations", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames);

      expect(svg).toContain('attributeName="opacity"');
    });

    test("should include size animations", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames);

      expect(svg).toContain('attributeName="width"');
      expect(svg).toContain('attributeName="height"');
    });

    test("should handle eaten positions", () => {
      const frames = createMockFrames();
      frames[1].eatenPosition = { x: 5, y: 3 };
      const svg = renderAnimatedSVG(frames);

      // Should have cell animations
      expect(svg).toContain('attributeName="fill"');
    });
  });
});

// ============================================
// Edge Cases
// ============================================

describe("Renderer - Edge Cases", () => {
  test("should handle single frame animation", () => {
    const frames = createMockFrames().slice(0, 1);
    const svg = renderAnimatedSVG(frames);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  test("should handle snake with many segments", () => {
    const grid = createMockGrid();
    const snake: SnakeState = {
      segments: Array.from({ length: 20 }, (_, i) => ({
        x: 20 - i,
        y: 3,
        direction: "right" as const,
      })),
      direction: "right",
      length: 20,
      score: 19,
    };

    const svg = renderStaticSVG(grid, snake);
    expect(svg).toContain("<svg");
  });

  test("should handle empty grid", () => {
    const grid: ContributionGrid = {
      username: "test",
      year: 2025,
      totalContributions: 0,
      weeks: [],
    };
    const snake = createMockSnake();

    const svg = renderStaticSVG(grid, snake);
    expect(svg).toContain("<svg");
  });
});

// ============================================
// Duration Calculation Tests
// ============================================

describe("Renderer - Duration and Frame Timing", () => {
  describe("duration option", () => {
    test("should calculate frame duration from total duration", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { duration: 3.0 });

      // 3 frames, 3 seconds = 1 second per frame
      expect(svg).toContain('dur="3.00s"');
    });

    test("should override frameDelay when duration is provided", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, {
        duration: 1.5,
        frameDelay: 500, // Should be ignored
      });

      // 3 frames, 1.5 seconds = 0.5 seconds per frame
      expect(svg).toContain('dur="1.50s"');
    });

    test("should use frameDelay when duration is not provided", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { frameDelay: 200 });

      // 3 frames, 200ms each = 0.6 seconds total
      expect(svg).toContain('dur="0.60s"');
    });

    test("should handle duration of 0", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { duration: 0 });

      // 0 duration means 0ms per frame
      expect(svg).toContain('dur="0.00s"');
    });

    test("should handle very short duration", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { duration: 0.1 });

      expect(svg).toContain('dur="0.10s"');
    });

    test("should handle very long duration", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { duration: 60 });

      expect(svg).toContain('dur="60.00s"');
    });

    test("should handle single frame with duration", () => {
      const grid = createMockGrid();
      const singleFrame: SnakeFrame[] = [
        {
          snake: {
            segments: [{ x: 0, y: 0, direction: "right" }],
            direction: "right",
            length: 1,
            score: 0,
          },
          grid,
          frameIndex: 0,
        },
      ];

      const svg = renderAnimatedSVG(singleFrame, { duration: 5 });

      // 1 frame, 5 seconds
      expect(svg).toContain('dur="5.00s"');
    });

    test("should calculate per-frame duration correctly for many frames", () => {
      const grid = createMockGrid();
      const manyFrames: SnakeFrame[] = Array.from({ length: 100 }, (_, i) => ({
        snake: {
          segments: [{ x: i % 53, y: i % 7, direction: "right" }],
          direction: "right",
          length: 1,
          score: 0,
        },
        grid,
        frameIndex: i,
      }));

      const svg = renderAnimatedSVG(manyFrames, { duration: 10 });

      // 100 frames, 10 seconds = 0.1s per frame
      expect(svg).toContain('dur="10.00s"');
    });
  });

  describe("frameDelay fallback", () => {
    test("should use default frameDelay when neither duration nor frameDelay provided", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, {});

      // Default is 150ms from DEFAULT_OPTIONS, 3 frames = 450ms = 0.45s
      expect(svg).toContain('dur="0.45s"');
    });

    test("should fall back to 60ms when frameDelay is undefined", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { frameDelay: undefined });

      // Fallback is 60ms, 3 frames = 180ms = 0.18s
      expect(svg).toContain('dur="0.18s"');
    });

    test("should handle frameDelay of 0", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { frameDelay: 0 });

      // 0ms per frame
      expect(svg).toContain('dur="0.00s"');
    });
  });

  describe("edge cases", () => {
    test("should handle null duration explicitly", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { duration: null as any });

      // null should be treated as undefined, fall back to frameDelay
      expect(svg).toContain("<svg");
    });

    test("should handle undefined duration explicitly", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { duration: undefined });

      // Should fall back to frameDelay
      expect(svg).toContain("<svg");
    });

    test("should handle negative duration", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { duration: -5 });

      // Negative duration results in negative per-frame duration
      expect(svg).toContain('dur="-5.00s"');
    });

    test("should handle fractional frameDelay", () => {
      const frames = createMockFrames();
      const svg = renderAnimatedSVG(frames, { frameDelay: 33.333 });

      // 3 frames, 33.333ms each ≈ 100ms = 0.1s
      expect(svg).toMatch(/dur="0\.1[0-9]+s"/);
    });
  });
});

// ============================================
// renderSnakeSegments Refactoring Tests
// ============================================

describe("Renderer - Snake Segment Rendering", () => {
  describe("renderSnakeSegments function", () => {
    test("should render head with head color", () => {
      const grid = createMockGrid();
      const snake: SnakeState = {
        segments: [
          { x: 5, y: 3, direction: "right" },
          { x: 4, y: 3, direction: "right" },
          { x: 3, y: 3, direction: "right" },
        ],
        direction: "right",
        length: 3,
        score: 0,
      };

      const svg = renderStaticSVG(grid, snake);
      const headColor = themes["github-dark"].snake.head;

      expect(svg).toContain(`fill="${headColor}"`);
    });

    test("should render tail with tail color", () => {
      const grid = createMockGrid();
      const snake: SnakeState = {
        segments: [
          { x: 5, y: 3, direction: "right" },
          { x: 4, y: 3, direction: "right" },
          { x: 3, y: 3, direction: "right" },
        ],
        direction: "right",
        length: 3,
        score: 0,
      };

      const svg = renderStaticSVG(grid, snake);
      const tailColor = themes["github-dark"].snake.tail;

      expect(svg).toContain(`fill="${tailColor}"`);
    });

    test("should render body segments with body color", () => {
      const grid = createMockGrid();
      const snake: SnakeState = {
        segments: [
          { x: 5, y: 3, direction: "right" },
          { x: 4, y: 3, direction: "right" },
          { x: 3, y: 3, direction: "right" },
          { x: 2, y: 3, direction: "right" },
        ],
        direction: "right",
        length: 4,
        score: 0,
      };

      const svg = renderStaticSVG(grid, snake);
      const bodyColor = themes["github-dark"].snake.body;

      // Should have at least 2 body segments (between head and tail)
      const bodyMatches = svg.match(new RegExp(`fill="${bodyColor}"`, "g"));
      expect(bodyMatches).toBeTruthy();
      expect(bodyMatches!.length).toBeGreaterThanOrEqual(2);
    });

    test("should render single segment snake with head color", () => {
      const grid = createMockGrid();
      const snake: SnakeState = {
        segments: [{ x: 5, y: 3, direction: "right" }],
        direction: "right",
        length: 1,
        score: 0,
      };

      const svg = renderStaticSVG(grid, snake);
      const headColor = themes["github-dark"].snake.head;

      expect(svg).toContain(`fill="${headColor}"`);
    });

    test("should render two-segment snake with head and tail", () => {
      const grid = createMockGrid();
      const snake: SnakeState = {
        segments: [
          { x: 5, y: 3, direction: "right" },
          { x: 4, y: 3, direction: "right" },
        ],
        direction: "right",
        length: 2,
        score: 0,
      };

      const svg = renderStaticSVG(grid, snake);
      const headColor = themes["github-dark"].snake.head;
      const tailColor = themes["github-dark"].snake.tail;

      expect(svg).toContain(`fill="${headColor}"`);
      expect(svg).toContain(`fill="${tailColor}"`);
    });

    test("should position segments correctly based on grid coordinates", () => {
      const grid = createMockGrid();
      const snake: SnakeState = {
        segments: [
          { x: 0, y: 0, direction: "right" },
          { x: 1, y: 1, direction: "right" },
        ],
        direction: "right",
        length: 2,
        score: 0,
      };

      const svg = renderStaticSVG(grid, snake);
      const cellSize = 11;
      const gap = 3;

      // First segment at (0, 0)
      const x0 = gap + 0 * (cellSize + gap);
      const y0 = gap + 0 * (cellSize + gap);
      expect(svg).toContain(`x="${x0}" y="${y0}"`);

      // Second segment at (1, 1)
      const x1 = gap + 1 * (cellSize + gap);
      const y1 = gap + 1 * (cellSize + gap);
      expect(svg).toContain(`x="${x1}" y="${y1}"`);
    });

    test("should apply rounded corners (rx=2) to all segments", () => {
      const grid = createMockGrid();
      const snake = createMockSnake();

      const svg = renderStaticSVG(grid, snake);

      const rxMatches = svg.match(/rx="2"/g);
      expect(rxMatches).toBeTruthy();
      // 371 grid cells + 3 snake segments = 374 elements with rounded corners
      expect(rxMatches!.length).toBe(371 + snake.segments.length);
    });

    test("should render segments in correct order (head first)", () => {
      const grid = createMockGrid();
      const snake: SnakeState = {
        segments: [
          { x: 5, y: 3, direction: "right" }, // head
          { x: 4, y: 3, direction: "right" }, // body
          { x: 3, y: 3, direction: "right" }, // tail
        ],
        direction: "right",
        length: 3,
        score: 0,
      };

      const svg = renderStaticSVG(grid, snake);
      const headColor = themes["github-dark"].snake.head;
      const tailColor = themes["github-dark"].snake.tail;

      const headIndex = svg.indexOf(`fill="${headColor}"`);
      const tailIndex = svg.indexOf(`fill="${tailColor}"`);

      // Head should appear before tail in SVG
      expect(headIndex).toBeLessThan(tailIndex);
    });
  });

  describe("glass theme filter attribute", () => {
    test("should not apply glass filter to non-glass themes", () => {
      const grid = createMockGrid();
      const snake = createMockSnake();

      const themes = ["github-dark", "github-light", "ocean", "sunset", "neon-gamer", "cypherpunk"];

      for (const themeName of themes) {
        const svg = renderStaticSVG(grid, snake, { palette: getTheme(themeName) });
        expect(svg).not.toContain('filter="url(#glass-glow)"');
      }
    });
  });
});
