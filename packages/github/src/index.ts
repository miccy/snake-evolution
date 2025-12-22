// Snake Evolution - GitHub API Client
// Supports both GraphQL API (with token) and HTML scraping (public)

import type { ContributionGrid, GitHubContribution } from "@snake-evolution/types";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

// ============================================
// TypeScript Interfaces
// ============================================

interface ContributionDay {
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: ContributionWeek[];
        };
      };
    };
  };
}

// ============================================
// Main Export Functions
// ============================================

/**
 * Fetch contribution data - uses GraphQL if token provided, otherwise scrapes HTML
 */
export function fetchContributions(
  username: string,
  token?: string,
  year?: number,
): Promise<ContributionGrid> {
  if (token) {
    return fetchContributionsGraphQL(username, token, year);
  }
  return fetchContributionsHTML(username, year);
}

/**
 * Fetch contributions via public HTML scraping (no auth required)
 */
export function fetchPublicContributions(
  username: string,
  year?: number,
): Promise<ContributionGrid> {
  return fetchContributionsHTML(username, year);
}

// ============================================
// GraphQL API (requires token)
// ============================================

async function fetchContributionsGraphQL(
  username: string,
  token: string,
  year?: number,
): Promise<ContributionGrid> {
  const query = `
    query($username: String!, $from: DateTime, $to: DateTime) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                contributionLevel
                date
              }
            }
          }
        }
      }
    }
  `;

  const targetYear = year ?? new Date().getFullYear();
  const from = `${targetYear}-01-01T00:00:00Z`;
  const to = `${targetYear}-12-31T23:59:59Z`;

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { username, from, to },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const json = (await response.json()) as GraphQLResponse;

  if (!json.data?.user) {
    throw new Error(`User not found: ${username}`);
  }

  const calendar = json.data.user.contributionsCollection.contributionCalendar;

  const weeks: GitHubContribution[][] = calendar.weeks.map((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: levelToNumber(day.contributionLevel),
    })),
  );

  return {
    username,
    year: targetYear,
    totalContributions: calendar.totalContributions,
    weeks,
  };
}

function levelToNumber(level: ContributionDay["contributionLevel"]): 0 | 1 | 2 | 3 | 4 {
  switch (level) {
    case "NONE":
      return 0;
    case "FIRST_QUARTILE":
      return 1;
    case "SECOND_QUARTILE":
      return 2;
    case "THIRD_QUARTILE":
      return 3;
    case "FOURTH_QUARTILE":
      return 4;
  }
}

// ============================================
// HTML Scraping (public, no auth)
// ============================================

async function fetchContributionsHTML(username: string, year?: number): Promise<ContributionGrid> {
  const targetYear = year ?? new Date().getFullYear();
  const url = `https://github.com/users/${username}/contributions?from=${targetYear}-01-01&to=${targetYear}-12-31`;

  const response = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": "Snake-Evolution/1.0",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`User not found: ${username}`);
    }
    throw new Error(`GitHub error: ${response.status}`);
  }

  const html = await response.text();
  return parseContributionCalendar(html, username, targetYear);
}

// We approximate missing counts from the visual level so the grid stays usable even without data-count.
function contributionCountFromLevel(level: number): number {
  if (level <= 0) return 0;
  return level * 3;
}

function parseContributionCalendar(html: string, username: string, year: number): ContributionGrid {
  // Parse the contribution calendar from GitHub's HTML
  // The calendar contains <td> elements with data-date and data-level attributes

  const weeks: GitHubContribution[][] = [];
  let currentWeek: GitHubContribution[] = [];
  let totalContributions = 0;

  // Match all contribution day cells
  // GitHub uses: <td ... data-date="2025-01-01" data-count="4" data-level="3" ...>
  const dayPattern =
    /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*?(?:data-count="(\d+)"[^>]*?)?data-level="(-?\d+)"[^>]*>/g;
  const days: Array<{ date: string; level: number; count?: number }> = [];

  for (const match of html.matchAll(dayPattern)) {
    days.push({
      date: match[1],
      level: Number.parseInt(match[3], 10),
      count: match[2] ? Number.parseInt(match[2], 10) : undefined,
    });
  }

  // Also try the alternate pattern (data-level before data-date)
  const altPattern =
    /<td[^>]*data-level="(-?\d+)"[^>]*?(?:data-count="(\d+)"[^>]*?)?data-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g;
  for (const match of html.matchAll(altPattern)) {
    // Avoid duplicates
    const date = match[3];
    if (!days.some((d) => d.date === date)) {
      days.push({
        date,
        level: Number.parseInt(match[1], 10),
        count: match[2] ? Number.parseInt(match[2], 10) : undefined,
      });
    }
  }

  // Sort by date
  days.sort((a, b) => a.date.localeCompare(b.date));

  // Group into weeks (7 days each)
  for (const day of days) {
    const level = Math.max(0, Math.min(4, day.level)) as 0 | 1 | 2 | 3 | 4;
    const count = day.count ?? contributionCountFromLevel(level);

    totalContributions += count;

    currentWeek.push({
      date: day.date,
      count,
      level,
    });

    // New week every 7 days
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Don't forget the last partial week
  if (currentWeek.length > 0) {
    // Pad to 7 days if needed
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: "",
        count: 0,
        level: 0,
      });
    }
    weeks.push(currentWeek);
  }

  // If no data found, create empty grid
  if (weeks.length === 0) {
    console.warn("No contribution data found in HTML, creating empty grid");
    for (let w = 0; w < 53; w++) {
      const week: GitHubContribution[] = [];
      for (let d = 0; d < 7; d++) {
        week.push({ date: "", count: 0, level: 0 });
      }
      weeks.push(week);
    }
  }

  return {
    username,
    year,
    totalContributions,
    weeks,
  };
}

// ============================================
// Exports
// ============================================

export type { ContributionGrid, GitHubContribution };
