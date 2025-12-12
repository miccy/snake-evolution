// Snake Evolution - GitHub API Client

import type { ContributionGrid, GitHubContribution } from "@snake-evolution/types";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

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

/**
 * Fetch contribution data from GitHub GraphQL API
 */
export async function fetchContributions(
  username: string,
  token?: string,
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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers,
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

/**
 * Fetch contributions without auth (limited rate)
 */
export async function fetchPublicContributions(
  username: string,
  year?: number,
): Promise<ContributionGrid> {
  // Fallback: scrape from public profile
  // For now, just call the GraphQL API without token
  return await fetchContributions(username, undefined, year);
}

export type { ContributionGrid, GitHubContribution };
