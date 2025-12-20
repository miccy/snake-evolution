import { describe, expect, test } from "bun:test";
import type { ContributionGrid, GitHubContribution } from "@snake-evolution/types";

// ============================================
// Type Tests (no network calls)
// ============================================

describe("GitHub - Types", () => {
  describe("ContributionGrid", () => {
    test("should have correct structure", () => {
      const grid: ContributionGrid = {
        username: "testuser",
        year: 2025,
        totalContributions: 100,
        weeks: [],
      };

      expect(grid.username).toBe("testuser");
      expect(grid.year).toBe(2025);
      expect(grid.totalContributions).toBe(100);
      expect(Array.isArray(grid.weeks)).toBe(true);
    });

    test("should accept valid week structure", () => {
      const week: GitHubContribution[] = [
        { date: "2025-01-01", count: 5, level: 3 },
        { date: "2025-01-02", count: 0, level: 0 },
        { date: "2025-01-03", count: 1, level: 1 },
        { date: "2025-01-04", count: 2, level: 2 },
        { date: "2025-01-05", count: 10, level: 4 },
        { date: "2025-01-06", count: 0, level: 0 },
        { date: "2025-01-07", count: 3, level: 2 },
      ];

      expect(week).toHaveLength(7);
      expect(week[0].count).toBe(5);
      expect(week[0].level).toBe(3);
    });

    test("should accept full grid with weeks", () => {
      const weeks: GitHubContribution[][] = Array.from({ length: 53 }, (_, weekIdx) =>
        Array.from({ length: 7 }, (_, dayIdx) => ({
          date: `2025-01-${String(weekIdx * 7 + dayIdx + 1).padStart(2, "0")}`,
          count: Math.floor(Math.random() * 10),
          level: Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4,
        })),
      );

      const grid: ContributionGrid = {
        username: "testuser",
        year: 2025,
        totalContributions: weeks.flat().filter((d) => d.count > 0).length,
        weeks,
      };

      expect(grid.weeks).toHaveLength(53);
      expect(grid.weeks[0]).toHaveLength(7);
    });

    test("level should be 0-4", () => {
      const validLevels: Array<0 | 1 | 2 | 3 | 4> = [0, 1, 2, 3, 4];

      for (const level of validLevels) {
        const contribution: GitHubContribution = {
          date: "2025-01-01",
          count: level,
          level,
        };
        expect(contribution.level).toBe(level);
      }
    });
  });
});

// ============================================
// Utility Function Tests
// ============================================

describe("GitHub - Utilities", () => {
  describe("Grid Creation", () => {
    test("should create empty 53x7 grid", () => {
      const weeks: GitHubContribution[][] = Array.from({ length: 53 }, () =>
        Array.from({ length: 7 }, () => ({
          date: "",
          count: 0,
          level: 0 as const,
        })),
      );

      expect(weeks).toHaveLength(53);
      expect(weeks.every((w) => w.length === 7)).toBe(true);
    });

    test("should count contributions correctly", () => {
      const weeks: GitHubContribution[][] = [
        [
          { date: "2025-01-01", count: 5, level: 3 },
          { date: "2025-01-02", count: 0, level: 0 },
          { date: "2025-01-03", count: 1, level: 1 },
          { date: "2025-01-04", count: 0, level: 0 },
          { date: "2025-01-05", count: 10, level: 4 },
          { date: "2025-01-06", count: 0, level: 0 },
          { date: "2025-01-07", count: 3, level: 2 },
        ],
      ];

      const contributionCount = weeks.flat().reduce((sum, d) => sum + d.count, 0);
      expect(contributionCount).toBe(19); // 5 + 1 + 10 + 3 = 19
    });
  });

  describe("Date Parsing", () => {
    test("should parse valid dates", () => {
      const dateStr = "2025-12-18";
      const date = new Date(dateStr);

      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(11); // December is 11
      expect(date.getDate()).toBe(18);
    });

    test("should handle year range", () => {
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(`${currentYear}-01-01`);
      const endOfYear = new Date(`${currentYear}-12-31`);

      expect(startOfYear.getMonth()).toBe(0);
      expect(endOfYear.getMonth()).toBe(11);
    });
  });

  describe("HTML parsing", () => {
    test("should sum contributions from data-count and keep date order", async () => {
      const html = `
        <table>
          <tr>
            <td data-date="2024-12-28" data-count="1" data-level="1"></td>
            <td data-level="2" data-count="4" data-date="2024-12-29"></td>
            <td data-level="3" data-date="2024-12-30"></td>
          </tr>
        </table>
      `;

      const originalFetch = globalThis.fetch;
      const mockFetch: typeof fetch = async () =>
        new Response(html, {
          status: 200,
          headers: { "Content-Type": "text/html" },
        });

      globalThis.fetch = mockFetch;

      try {
        const { fetchPublicContributions } = await import("../src/index");
        const grid = await fetchPublicContributions("octocat", 2024);
        const parsedDays = grid.weeks.flat().filter((d) => d.date);

        expect(grid.totalContributions).toBe(14); // 1 + 4 + fallback 9 from level 3
        expect(parsedDays.slice(0, 3)).toEqual([
          { date: "2024-12-28", count: 1, level: 1 },
          { date: "2024-12-29", count: 4, level: 2 },
          { date: "2024-12-30", count: 9, level: 3 },
        ]);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });
});

// ============================================
// Module Export Tests
// ============================================

describe("GitHub - Module Exports", () => {
  test("should export fetchContributions function", async () => {
    const { fetchContributions } = await import("../src/index");
    expect(typeof fetchContributions).toBe("function");
  });

  test("should export fetchPublicContributions function", async () => {
    const { fetchPublicContributions } = await import("../src/index");
    expect(typeof fetchPublicContributions).toBe("function");
  });

  test("should export ContributionGrid type (compile-time check)", async () => {
    // This is primarily a compile-time check
    const { fetchContributions } = await import("../src/index");

    // Function signature should return Promise<ContributionGrid>
    expect(fetchContributions.length).toBeGreaterThanOrEqual(1); // Has at least username param
  });
});

// ============================================
// Mock Data Tests
// ============================================

describe("GitHub - Mock Data", () => {
  test("should create realistic contribution pattern", () => {
    // Simulate a developer's contribution pattern
    const weeks: GitHubContribution[][] = [];

    const getLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
      if (count === 0) return 0;
      if (count <= 2) return 1;
      if (count <= 4) return 2;
      if (count <= 6) return 3;
      return 4;
    };

    const startDate = new Date("2025-01-01");
    for (let w = 0; w < 53; w++) {
      const week: GitHubContribution[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + w * 7 + d);
        const dateStr = currentDate.toISOString().split("T")[0];

        // Weekdays (Mon-Fri, indices 1-5) have more contributions
        const isWeekday = d >= 1 && d <= 5;
        const count = isWeekday ? Math.floor(Math.random() * 8) : Math.floor(Math.random() * 3);
        const level = getLevel(count);

        week.push({
          date: dateStr,
          count,
          level,
        });
      }
      weeks.push(week);
    }

    const grid: ContributionGrid = {
      username: "developer",
      year: 2025,
      totalContributions: weeks.flat().filter((d) => d.count > 0).length,
      weeks,
    };

    expect(grid.weeks).toHaveLength(53);
    expect(grid.totalContributions).toBeGreaterThan(0);
  });

  test("should handle empty contribution year", () => {
    const emptyWeeks: GitHubContribution[][] = Array.from({ length: 53 }, () =>
      Array.from({ length: 7 }, () => ({
        date: "",
        count: 0,
        level: 0 as const,
      })),
    );

    const grid: ContributionGrid = {
      username: "inactive",
      year: 2025,
      totalContributions: 0,
      weeks: emptyWeeks,
    };

    expect(grid.totalContributions).toBe(0);
    expect(grid.weeks.flat().every((d) => d.count === 0)).toBe(true);
  });
});
