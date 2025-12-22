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
