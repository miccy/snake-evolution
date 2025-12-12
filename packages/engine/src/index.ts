// Snake Evolution - Game Engine

import type { ContributionGrid, Direction, Position, SnakeState } from "@snake-evolution/types";

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
 * Move snake one step in current direction
 */
export function moveSnake(snake: SnakeState, direction?: Direction): SnakeState {
  const newDirection = direction ?? snake.direction;
  const head = snake.segments[0];

  const newHead: Position = { ...head };

  switch (newDirection) {
    case "up":
      newHead.y -= 1;
      break;
    case "down":
      newHead.y += 1;
      break;
    case "left":
      newHead.x -= 1;
      break;
    case "right":
      newHead.x += 1;
      break;
  }

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
 * Check if position has a contribution to eat
 */
export function hasContribution(grid: ContributionGrid, pos: Position): boolean {
  const week = grid.weeks[pos.x];
  if (!week) return false;
  const day = week[pos.y];
  return day ? day.count > 0 : false;
}

/**
 * Grow snake by one segment
 */
export function growSnake(snake: SnakeState, points: number = 1): SnakeState {
  const tail = snake.segments[snake.segments.length - 1];
  return {
    ...snake,
    segments: [...snake.segments, { ...tail }],
    length: snake.length + 1,
    score: snake.score + points,
  };
}

/**
 * Find path to nearest contribution using simple pathfinding
 */
export function findNearestContribution(
  grid: ContributionGrid,
  position: Position,
): Position | null {
  let nearest: Position | null = null;
  let minDistance = Number.POSITIVE_INFINITY;

  for (let x = 0; x < grid.weeks.length; x++) {
    const week = grid.weeks[x];
    for (let y = 0; y < week.length; y++) {
      if (week[y].count > 0) {
        const distance = Math.abs(x - position.x) + Math.abs(y - position.y);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = { x, y };
        }
      }
    }
  }

  return nearest;
}

export type { Direction, Position, SnakeState };
