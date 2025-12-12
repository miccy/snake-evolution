// Snake Evolution - Game Engine
// Inspired by Platane's algorithm, optimized for modern TypeScript

import type {
  ContributionGrid,
  Direction,
  Position,
  SimulationOptions,
  SnakeFrame,
  SnakeState,
} from "@snake-evolution/types";

// ============================================
// Snake Creation & Movement
// ============================================

/**
 * Initialize a new snake at starting position
 */
export function createSnake(startPosition: Position): SnakeState {
  return {
    segments: [{ ...startPosition, direction: "right" }],
    direction: "right",
    length: 1,
    score: 0,
  };
}

/**
 * Move snake one step in given direction
 */
export function moveSnake(snake: SnakeState, direction?: Direction): SnakeState {
  const newDirection = direction ?? snake.direction;
  const head = snake.segments[0];

  const delta = directionDelta(newDirection);
  const newHead: Position = {
    x: head.x + delta.x,
    y: head.y + delta.y,
  };

  const newSegments = [
    { ...newHead, direction: newDirection },
    ...snake.segments.slice(0, snake.length - 1),
  ];

  return {
    ...snake,
    segments: newSegments,
    direction: newDirection,
  };
}

/**
 * Grow snake by adding segments at tail
 */
export function growSnake(snake: SnakeState, count: number = 1): SnakeState {
  const tail = snake.segments[snake.segments.length - 1];
  const newSegments = [...snake.segments];

  for (let i = 0; i < count; i++) {
    newSegments.push({ ...tail });
  }

  return {
    ...snake,
    segments: newSegments,
    length: snake.length + count,
    score: snake.score + count,
  };
}

// ============================================
// Grid Operations
// ============================================

/**
 * Check if position has a contribution to eat
 */
export function hasContribution(grid: ContributionGrid, pos: Position): boolean {
  const week = grid.weeks[pos.x];
  if (!week) return false;
  const day = week[pos.y];
  return day ? day.count > 0 : false;
}

/**
 * Remove contribution from grid (mark as eaten)
 */
export function eatContribution(grid: ContributionGrid, pos: Position): ContributionGrid {
  const newWeeks = grid.weeks.map((week, x) =>
    x === pos.x
      ? week.map((day, y) => (y === pos.y ? { ...day, count: 0, level: 0 as const } : day))
      : week,
  );

  return {
    ...grid,
    weeks: newWeeks,
    totalContributions: grid.totalContributions - 1,
  };
}

/**
 * Count remaining contributions in grid
 */
export function countContributions(grid: ContributionGrid): number {
  let count = 0;
  for (const week of grid.weeks) {
    for (const day of week) {
      if (day.count > 0) count++;
    }
  }
  return count;
}

/**
 * Check if position is within grid bounds
 */
export function isInBounds(grid: ContributionGrid, pos: Position): boolean {
  return pos.x >= 0 && pos.x < grid.weeks.length && pos.y >= 0 && pos.y < 7;
}

/**
 * Check if snake occupies a position
 * @param excludeTail - if true, exclude tail segment (it will move away next turn)
 */
export function snakeOccupies(snake: SnakeState, pos: Position, excludeTail = false): boolean {
  const segments = excludeTail ? snake.segments.slice(0, -1) : snake.segments;
  return segments.some((seg) => seg.x === pos.x && seg.y === pos.y);
}

// ============================================
// Pathfinding (BFS)
// ============================================

const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

function directionDelta(dir: Direction): Position {
  switch (dir) {
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
  }
}

function oppositeDirection(dir: Direction): Direction {
  switch (dir) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
  }
}

/**
 * Find next direction to move towards nearest contribution using BFS
 * Returns null if no path exists
 */
export function findNextDirection(grid: ContributionGrid, snake: SnakeState): Direction | null {
  const head = snake.segments[0];
  const currentDir = snake.direction;

  // BFS to find nearest contribution
  const queue: Array<{ pos: Position; firstDir: Direction | null; dist: number }> = [];
  const visited = new Set<string>();
  const key = (p: Position) => `${p.x},${p.y}`;

  // Start from neighbors of head
  for (const dir of DIRECTIONS) {
    // Can't go backwards
    if (dir === oppositeDirection(currentDir) && snake.length > 1) continue;

    const delta = directionDelta(dir);
    const nextPos = { x: head.x + delta.x, y: head.y + delta.y };

    if (!isInBounds(grid, nextPos)) continue;
    // Exclude tail since it will move away (unless snake just ate and is growing)
    if (snakeOccupies(snake, nextPos, true)) continue;

    queue.push({ pos: nextPos, firstDir: dir, dist: 1 });
    visited.add(key(nextPos));
  }

  // BFS loop
  while (queue.length > 0) {
    const current = queue.shift()!;

    // Found a contribution!
    if (hasContribution(grid, current.pos)) {
      return current.firstDir;
    }

    // Explore neighbors
    for (const dir of DIRECTIONS) {
      const delta = directionDelta(dir);
      const nextPos = { x: current.pos.x + delta.x, y: current.pos.y + delta.y };
      const k = key(nextPos);

      if (!isInBounds(grid, nextPos)) continue;
      if (visited.has(k)) continue;
      if (snakeOccupies(snake, nextPos, true)) continue;

      visited.add(k);
      queue.push({ pos: nextPos, firstDir: current.firstDir, dist: current.dist + 1 });
    }
  }

  // No path to any contribution - try to find any valid move
  for (const dir of DIRECTIONS) {
    if (dir === oppositeDirection(currentDir) && snake.length > 1) continue;

    const delta = directionDelta(dir);
    const nextPos = { x: head.x + delta.x, y: head.y + delta.y };

    if (isInBounds(grid, nextPos) && !snakeOccupies(snake, nextPos)) {
      return dir;
    }
  }

  return null;
}

// ============================================
// Simulation Loop
// ============================================

/**
 * Run complete snake simulation through contribution grid
 * Returns array of frames for animation
 */
export function simulateSnake(
  initialGrid: ContributionGrid,
  options: SimulationOptions = {},
): SnakeFrame[] {
  const {
    startPosition = { x: 0, y: 3 },
    maxLength = 10,
    growEvery = 4,
    maxSteps = 2000,
    frameMode = "every",
  } = options;

  const frames: SnakeFrame[] = [];
  let snake = createSnake(startPosition);
  let grid = initialGrid;
  let frameIndex = 0;
  let contributionsEaten = 0;

  // Initial frame
  frames.push({
    snake: { ...snake, segments: [...snake.segments] },
    grid,
    frameIndex: frameIndex++,
  });

  let steps = 0;
  while (countContributions(grid) > 0 && steps < maxSteps) {
    const direction = findNextDirection(grid, snake);

    // No valid move - snake is stuck
    if (!direction) break;

    // Move snake
    snake = moveSnake(snake, direction);
    steps++;

    const head = snake.segments[0];
    let eatenPosition: Position | undefined;

    // Check if eating
    if (hasContribution(grid, head)) {
      grid = eatContribution(grid, head);
      contributionsEaten++;
      eatenPosition = { ...head };

      // Grow snake only every N contributions and if under max length
      if (snake.length < maxLength && contributionsEaten % growEvery === 0) {
        snake = growSnake(snake, 1);
      }
    }

    // Record frame
    if (frameMode === "every" || eatenPosition) {
      frames.push({
        snake: { ...snake, segments: snake.segments.map((s) => ({ ...s })) },
        grid,
        eatenPosition,
        frameIndex: frameIndex++,
      });
    }
  }

  // Return journey - snake travels back to start
  const returnSteps = 50; // Add some frames for return journey
  const targetY = startPosition.y;

  // First, move toward center Y
  while (snake.segments[0].y !== targetY && steps < maxSteps + returnSteps) {
    const dir = snake.segments[0].y > targetY ? "up" : "down";
    snake = moveSnake(snake, dir as Direction);
    steps++;
    frames.push({
      snake: { ...snake, segments: snake.segments.map((s) => ({ ...s })) },
      grid,
      frameIndex: frameIndex++,
    });
  }

  // Then, move left back toward start
  while (snake.segments[0].x > startPosition.x && steps < maxSteps + returnSteps) {
    snake = moveSnake(snake, "left");
    steps++;
    frames.push({
      snake: { ...snake, segments: snake.segments.map((s) => ({ ...s })) },
      grid,
      frameIndex: frameIndex++,
    });
  }

  return frames;
}

// ============================================
// Exports
// ============================================

export type { ContributionGrid, Direction, Position, SimulationOptions, SnakeFrame, SnakeState };
