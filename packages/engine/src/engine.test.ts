import { describe, expect, test } from "bun:test";
import type { ContributionGrid, SnakeState } from "@snake-evolution/types";
import {
  countContributions,
  createSnake,
  eatContribution,
  findNextDirection,
  growSnake,
  hasContribution,
  isInBounds,
  moveSnake,
  simulateSnake,
  snakeOccupies,
} from "./index";

function createEmptyGrid(weeks = 53, days = 7): ContributionGrid {
  const weekData = Array.from({ length: weeks }, () =>
    Array.from({ length: days }, () => ({
      date: "2025-01-01",
      count: 0,
      level: 0 as const,
    })),
  );
  return {
    username: "test",
    year: 2025,
    totalContributions: 0,
    weeks: weekData,
  };
}

function createGridWithContribution(
  x: number,
  y: number,
  level: 1 | 2 | 3 | 4 = 1,
): ContributionGrid {
  const grid = createEmptyGrid();
  grid.weeks[x][y] = { date: "2025-01-01", count: level, level };
  grid.totalContributions = 1;
  return grid;
}

describe("Engine - Snake", () => {
  describe("createSnake", () => {
    test("should create snake at given position", () => {
      const snake = createSnake({ x: 5, y: 3 });
      expect(snake.segments).toHaveLength(1);
      expect(snake.segments[0].x).toBe(5);
      expect(snake.segments[0].y).toBe(3);
      expect(snake.direction).toBe("right");
      expect(snake.length).toBe(1);
      expect(snake.score).toBe(0);
    });

    test("should default direction to right", () => {
      const snake = createSnake({ x: 0, y: 0 });
      expect(snake.direction).toBe("right");
    });
  });

  describe("moveSnake", () => {
    test("should move snake right by default", () => {
      const snake = createSnake({ x: 5, y: 3 });
      const moved = moveSnake(snake);
      expect(moved.segments[0].x).toBe(6);
      expect(moved.segments[0].y).toBe(3);
    });

    test("should move snake in given direction", () => {
      const snake = createSnake({ x: 5, y: 3 });
      expect(moveSnake(snake, "up").segments[0].y).toBe(2);
      expect(moveSnake(snake, "down").segments[0].y).toBe(4);
      expect(moveSnake(snake, "left").segments[0].x).toBe(4);
      expect(moveSnake(snake, "right").segments[0].x).toBe(6);
    });

    test("should update direction after move", () => {
      const snake = createSnake({ x: 5, y: 3 });
      const moved = moveSnake(snake, "up");
      expect(moved.direction).toBe("up");
    });
  });

  describe("growSnake", () => {
    test("should increase length by 1 by default", () => {
      const snake = createSnake({ x: 5, y: 3 });
      const grown = growSnake(snake);
      expect(grown.length).toBe(2);
      expect(grown.segments).toHaveLength(2);
    });

    test("should increase length by given count", () => {
      const snake = createSnake({ x: 5, y: 3 });
      const grown = growSnake(snake, 5);
      expect(grown.length).toBe(6);
    });

    test("should increase score", () => {
      const snake = createSnake({ x: 5, y: 3 });
      const grown = growSnake(snake, 3);
      expect(grown.score).toBe(3);
    });
  });
});

describe("Engine - Grid", () => {
  describe("hasContribution", () => {
    test("should return true if position has contribution", () => {
      const grid = createGridWithContribution(10, 3, 2);
      expect(hasContribution(grid, { x: 10, y: 3 })).toBe(true);
    });

    test("should return false for empty position", () => {
      const grid = createEmptyGrid();
      expect(hasContribution(grid, { x: 10, y: 3 })).toBe(false);
    });

    test("should return false for out of bounds", () => {
      const grid = createEmptyGrid();
      expect(hasContribution(grid, { x: 100, y: 3 })).toBe(false);
    });
  });

  describe("eatContribution", () => {
    test("should set cell count and level to 0", () => {
      const grid = createGridWithContribution(10, 3, 4);
      const eaten = eatContribution(grid, { x: 10, y: 3 });
      expect(eaten.weeks[10][3].count).toBe(0);
      expect(eaten.weeks[10][3].level).toBe(0);
    });

    test("should decrease totalContributions", () => {
      const grid = createGridWithContribution(10, 3, 2);
      const eaten = eatContribution(grid, { x: 10, y: 3 });
      expect(eaten.totalContributions).toBe(0);
    });

    test("should not mutate original grid", () => {
      const grid = createGridWithContribution(10, 3, 2);
      const eaten = eatContribution(grid, { x: 10, y: 3 });
      expect(grid.weeks[10][3].count).toBe(2);
      expect(eaten.weeks[10][3].count).toBe(0);
    });
  });

  describe("countContributions", () => {
    test("should return 0 for empty grid", () => {
      const grid = createEmptyGrid();
      expect(countContributions(grid)).toBe(0);
    });

    test("should count cells with contributions > 0", () => {
      const grid = createEmptyGrid();
      grid.weeks[5][2] = { date: "", count: 3, level: 2 };
      grid.weeks[10][4] = { date: "", count: 1, level: 1 };
      expect(countContributions(grid)).toBe(2);
    });
  });

  describe("isInBounds", () => {
    test("should return true for valid positions", () => {
      const grid = createEmptyGrid();
      expect(isInBounds(grid, { x: 0, y: 0 })).toBe(true);
      expect(isInBounds(grid, { x: 52, y: 6 })).toBe(true);
    });

    test("should return false for out of bounds", () => {
      const grid = createEmptyGrid();
      expect(isInBounds(grid, { x: -1, y: 0 })).toBe(false);
      expect(isInBounds(grid, { x: 53, y: 0 })).toBe(false);
      expect(isInBounds(grid, { x: 0, y: 7 })).toBe(false);
    });
  });

  describe("snakeOccupies", () => {
    test("should return true if snake is at position", () => {
      const snake: SnakeState = {
        segments: [
          { x: 5, y: 3, direction: "right" },
          { x: 4, y: 3, direction: "right" },
        ],
        direction: "right",
        length: 2,
        score: 0,
      };
      expect(snakeOccupies(snake, { x: 5, y: 3 })).toBe(true);
      expect(snakeOccupies(snake, { x: 4, y: 3 })).toBe(true);
    });

    test("should return false if snake is not at position", () => {
      const snake = createSnake({ x: 5, y: 3 });
      expect(snakeOccupies(snake, { x: 6, y: 3 })).toBe(false);
    });

    test("should exclude tail when excludeTail is true", () => {
      const snake: SnakeState = {
        segments: [
          { x: 5, y: 3, direction: "right" },
          { x: 4, y: 3, direction: "right" },
        ],
        direction: "right",
        length: 2,
        score: 0,
      };
      expect(snakeOccupies(snake, { x: 4, y: 3 }, true)).toBe(false);
      expect(snakeOccupies(snake, { x: 5, y: 3 }, true)).toBe(true);
    });
  });
});

describe("Engine - Path finding", () => {
  describe("findNextDirection", () => {
    test("should find path to contribution", () => {
      const grid = createGridWithContribution(5, 3, 1);
      const snake = createSnake({ x: 3, y: 3 });
      const direction = findNextDirection(grid, snake);
      expect(direction).toBe("right");
    });

    test("should return valid direction when no contributions", () => {
      const grid = createEmptyGrid();
      const snake = createSnake({ x: 26, y: 3 });
      const direction = findNextDirection(grid, snake);
      expect(direction).not.toBeNull();
    });
  });
});

describe("Engine - Simulation", () => {
  describe("simulateSnake", () => {
    test("should generate frames array", () => {
      const grid = createGridWithContribution(5, 3, 1);
      const frames = simulateSnake(grid);
      expect(Array.isArray(frames)).toBe(true);
      expect(frames.length).toBeGreaterThan(0);
    });

    test("should include initial frame", () => {
      const grid = createGridWithContribution(10, 3, 1);
      const frames = simulateSnake(grid, { startPosition: { x: 0, y: 3 } });
      expect(frames[0].frameIndex).toBe(0);
      expect(frames[0].snake.segments[0].x).toBe(0);
    });

    test("should eat all contributions", () => {
      const grid = createEmptyGrid();
      grid.weeks[2][3] = { date: "", count: 1, level: 1 };
      grid.weeks[4][3] = { date: "", count: 1, level: 1 };
      grid.totalContributions = 2;
      const frames = simulateSnake(grid, { startPosition: { x: 0, y: 3 } });
      const lastFrame = frames[frames.length - 1];
      expect(countContributions(lastFrame.grid)).toBe(0);
    });

    test("each frame should have valid structure", () => {
      const grid = createGridWithContribution(5, 3, 1);
      const frames = simulateSnake(grid);
      for (const frame of frames) {
        expect(frame).toHaveProperty("snake");
        expect(frame).toHaveProperty("grid");
        expect(frame).toHaveProperty("frameIndex");
      }
    });
  });
});
