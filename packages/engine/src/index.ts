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
 * Find next direction to move towards highest-value contribution
 * Prioritizes: level 4 > 3 > 2 > 1 (makes animation more dynamic)
 * Returns null if no path exists
 */
export function findNextDirection(grid: ContributionGrid, snake: SnakeState): Direction | null {
  const head = snake.segments[0];
  const currentDir = snake.direction;

  // Try each level from highest to lowest
  for (let targetLevel = 4; targetLevel >= 1; targetLevel--) {
    const result = findPathToLevel(grid, snake, head, currentDir, targetLevel);
    if (result) return result;
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

/**
 * BFS to find path to contribution of specific level
 */
function findPathToLevel(
  grid: ContributionGrid,
  snake: SnakeState,
  head: Position,
  currentDir: Direction,
  targetLevel: number,
): Direction | null {
  const queue: Array<{ pos: Position; firstDir: Direction | null; dist: number }> = [];
  const visited = new Set<string>();
  const key = (p: Position) => `${p.x},${p.y}`;

  // Start from neighbors of head
  for (const dir of DIRECTIONS) {
    if (dir === oppositeDirection(currentDir) && snake.length > 1) continue;

    const delta = directionDelta(dir);
    const nextPos = { x: head.x + delta.x, y: head.y + delta.y };

    if (!isInBounds(grid, nextPos)) continue;
    if (snakeOccupies(snake, nextPos, true)) continue;

    queue.push({ pos: nextPos, firstDir: dir, dist: 1 });
    visited.add(key(nextPos));
  }

  // BFS loop
  while (queue.length > 0) {
    const current = queue.shift()!;

    // Found a contribution of target level!
    const level = getContributionLevel(grid, current.pos);
    if (level === targetLevel) {
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

  return null;
}

/**
 * Get contribution level at position (0-4)
 */
function getContributionLevel(grid: ContributionGrid, pos: Position): number {
  const week = grid.weeks[pos.x];
  if (!week) return 0;
  const day = week[pos.y];
  return day?.level ?? 0;
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
  const { startPosition = { x: 0, y: 3 }, maxSteps = 2000, frameMode = "every" } = options;

  // Calculate safe max length: 5% of total grid cells (conservative to avoid trapping)
  const totalCells = initialGrid.weeks.length * 7; // 53 * 7 = 371
  const safeMaxLength = options.maxLength || Math.floor(totalCells * 0.05); // ~18 if not specified

  // Calculate dynamic growth rate: grow every N contributions so we reach max length
  const totalContributions = countContributions(initialGrid);
  const targetGrowth = safeMaxLength - 1; // We start at length 1
  // Use ceiling so we reach max length by the end (e.g., 226 contributions / 91 growth = grow every 3)
  const growEvery = options.growEvery || Math.max(1, Math.ceil(totalContributions / targetGrowth));

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
    let direction = findNextDirection(grid, snake);

    // If stuck, try shrinking until we can move
    while (!direction && snake.length > 1) {
      // Shrink by removing tail
      snake = {
        ...snake,
        segments: snake.segments.slice(0, -1),
        length: snake.length - 1,
      };
      direction = findNextDirection(grid, snake);
    }

    // Still no valid move after shrinking to length 1 - truly stuck
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
      if (snake.length < safeMaxLength && contributionsEaten % growEvery === 0) {
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

  // Return journey - snake stays full length, uses safe pathfinding to exit
  // Target: move left until completely off-screen

  while (snake.segments[0].x >= -snake.length && steps < maxSteps + 200) {
    // Try to move left first
    let moved = false;
    const head = snake.segments[0];

    // Preferred directions: left, then up/down toward center
    const preferredDirs: Direction[] = ["left"];
    if (head.y > startPosition.y) preferredDirs.push("up");
    if (head.y < startPosition.y) preferredDirs.push("down");
    if (head.y === startPosition.y) {
      preferredDirs.push("up", "down"); // either works
    }
    preferredDirs.push("right"); // last resort, go around

    for (const dir of preferredDirs) {
      // Don't go backwards
      if (dir === oppositeDirection(snake.direction) && snake.length > 1) continue;

      const delta = directionDelta(dir);
      const nextPos = { x: head.x + delta.x, y: head.y + delta.y };

      // Check if move is valid (don't collide with self, stay in reasonable bounds)
      if (nextPos.y >= 0 && nextPos.y < 7 && !snakeOccupies(snake, nextPos, true)) {
        snake = moveSnake(snake, dir);
        steps++;
        frames.push({
          snake: { ...snake, segments: snake.segments.map((s) => ({ ...s })) },
          grid,
          frameIndex: frameIndex++,
        });
        moved = true;
        break;
      }
    }

    // If stuck, shrink by 1 to free up space
    if (!moved && snake.length > 1) {
      snake = {
        ...snake,
        segments: snake.segments.slice(0, -1),
        length: snake.length - 1,
      };
    } else if (!moved) {
      break; // Truly stuck at length 1
    }
  }

  return frames;
}

// ============================================
// Exports
// ============================================

export type { ContributionGrid, Direction, Position, SimulationOptions, SnakeFrame, SnakeState };
