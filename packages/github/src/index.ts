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

  const now = new Date();
  const currentYear = now.getFullYear();
  const targetYear = year ?? currentYear;

  let from: string;
  let to: string;

  if (targetYear === currentYear) {
    // Rolling year: last 12 months ending today
    // Align start date to Sunday to ensure full weeks in the grid
    to = now.toISOString();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() - oneYearAgo.getDay()); // Align to previous Sunday
    from = oneYearAgo.toISOString();
  } else {
    // Calendar year: Jan 1 to Dec 31
    from = `${targetYear}-01-01T00:00:00Z`;
    to = `${targetYear}-12-31T23:59:59Z`;
  }

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

// Helper to fetch a specific calendar year
async function fetchYear(username: string, year: number): Promise<ContributionGrid> {
  const url = `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`;
  const response = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": "Snake-Evolution/1.0",
    },
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error(`User not found: ${username}`);
    throw new Error(`GitHub error: ${response.status}`);
  }

  const html = await response.text();
  return parseContributionCalendar(html, username, year);
}

async function fetchContributionsHTML(username: string, year?: number): Promise<ContributionGrid> {
  const now = new Date();
  const currentYear = now.getFullYear();
  const targetYear = year ?? currentYear;

  // If specific past year requested, just fetch it
  if (targetYear !== currentYear) {
    return fetchYear(username, targetYear);
  }

  // For rolling year (current), fetch this year AND last year
  const [currentGrid, prevGrid] = await Promise.all([
    fetchYear(username, currentYear),
    fetchYear(username, currentYear - 1),
  ]);

  // Merge logic
  // 1. Flatten both grids to list of days
  const allDays: GitHubContribution[] = [];

  // Helper to push week days
  const pushWeeks = (weeks: GitHubContribution[][]) => {
    for (const week of weeks) {
      for (const day of week) {
        if (day.date) allDays.push(day);
      }
    }
  };

  pushWeeks(prevGrid.weeks);
  pushWeeks(currentGrid.weeks);

  // 2. Sort to be safe
  allDays.sort((a, b) => a.date.localeCompare(b.date));

  // 3. Remove duplicates (overlap at year boundary?)
  const uniqueDays = allDays.filter(
    (day, index, self) => index === self.findIndex((d) => d.date === day.date),
  );

  // 4. Slice last 365 days (approx 53 weeks)
  // We want the graph to end TODAY.
  // And strip ~1 year back.
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  oneYearAgo.setDate(oneYearAgo.getDate() - oneYearAgo.getDay()); // Align to previous Sunday
  const fromDate = oneYearAgo.toISOString().split("T")[0];
  const toDate = now.toISOString().split("T")[0];

  const rollingDays = uniqueDays.filter((d) => d.date >= fromDate && d.date <= toDate);

  // 5. Reconstruct Weeks
  const weeks: GitHubContribution[][] = [];
  let currentWeek: GitHubContribution[] = [];

  // Align start to Sunday?
  // Should we pad the start to make the first week full?
  // The renderer likely draws whatever we give it.
  // But standard graph starts on Sunday.

  // Handle edge case of no contributions
  if (rollingDays.length === 0) {
    return {
      username,
      year: currentYear,
      totalContributions: 0,
      weeks: [],
    };
  }

  // Find the day of week of the first day
  const firstDayObj = new Date(rollingDays[0].date);
  const firstDayOfWeek = firstDayObj.getDay(); // 0 = Sunday

  // Pad beginning if not Sunday
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: "", count: 0, level: 0 });
  }

  for (const day of rollingDays) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Pad end
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0, level: 0 });
    }
    weeks.push(currentWeek);
  }

  // Calculate total
  const totalContributions = rollingDays.reduce((acc, d) => acc + d.count, 0);

  return {
    username,
    year: currentYear,
    totalContributions,
    weeks,
  };
}

// We approximate missing counts from the visual level so the grid stays usable even without data-count.
// NOTE: This is a heuristic (level * 3) and may result in inaccurate totals compared to the actual contribution count.
// GitHub's HTML often omits the exact count for public scraping, or hides it in tooltips.
function contributionCountFromLevel(level: number): number {
  if (level <= 0) return 0;
  return level * 3;
}

function parseContributionCalendar(html: string, username: string, year: number): ContributionGrid {
  const weeks: GitHubContribution[][] = [];
  let currentWeek: GitHubContribution[] = [];
  let totalContributions = 0;

  // Match all contribution day cells
  // GitHub uses: <td ... data-date="2025-01-01" data-count="4" data-level="3" ...>
  // We use a robust regex that captures date, count (optional), and level
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
    // Capturing groups: 1=level, 2=count(opt), 3=date
    const date = match[3];
    if (!days.some((d) => d.date === date)) {
      days.push({
        date,
        level: Number.parseInt(match[1], 10),
        count: match[2] ? Number.parseInt(match[2], 10) : undefined,
      });
    }
  }

  // Sort
  days.sort((a, b) => a.date.localeCompare(b.date));

  // Build grid with Sunday alignment
  if (days.length > 0) {
    const firstDate = new Date(days[0].date);
    const dayOfWeek = firstDate.getDay(); // 0 = Sunday

    // Pad beginning
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({ date: "", count: 0, level: 0 });
    }
  }

  for (const day of days) {
    const level = Math.max(0, Math.min(4, day.level)) as 0 | 1 | 2 | 3 | 4;
    const count = day.count ?? contributionCountFromLevel(level);

    totalContributions += count;
    currentWeek.push({
      date: day.date,
      count,
      level,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    // Pad end
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0, level: 0 });
    }
    weeks.push(currentWeek);
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
