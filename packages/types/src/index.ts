// Snake Evolution - Shared Types

// ============================================
// GitHub Types
// ============================================

export interface GitHubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionGrid {
  username: string;
  year: number;
  totalContributions: number;
  weeks: GitHubContribution[][];
}

// ============================================
// Snake Types
// ============================================

export interface Position {
  x: number;
  y: number;
}

export interface SnakeSegment extends Position {
  direction: Direction;
}

export type Direction = "up" | "down" | "left" | "right";

export interface SnakeState {
  segments: SnakeSegment[];
  direction: Direction;
  length: number;
  score: number;
}

// ============================================
// Rendering Types
// ============================================

export interface ColorPalette {
  name: string;
  background: string;
  empty: string;
  levels: [string, string, string, string];
  snake: {
    head: string;
    body: string;
    tail: string;
  };
}

export interface RenderOptions {
  width: number;
  height: number;
  cellSize: number;
  gap: number;
  palette: ColorPalette;
  animated: boolean;
  frameDelay: number;
}

export type OutputFormat = "svg" | "gif" | "png";

export interface GenerationRequest {
  username: string;
  year?: number;
  palette?: string;
  format?: OutputFormat;
  animated?: boolean;
}

export interface GenerationResult {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  url?: string;
  error?: string;
}

// ============================================
// API Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthCheckResponse {
  status: "ok" | "error";
  timestamp: string;
  version: string;
}
