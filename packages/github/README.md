# @snake-evolution/github

GitHub API client for Snake Evolution. Fetches contribution data via GraphQL or HTML scraping.

## Features

- 🔐 **GraphQL API** – Authenticated access with full data
- 🌐 **HTML Scraping** – Public access without token
- 📅 **Year Selection** – Fetch specific year's contributions
- ⚡ **Smart Fallback** – Automatically uses best available method

## Installation

```bash
bun add @snake-evolution/github
```

## Usage

```typescript
import { fetchContributions, fetchPublicContributions } from '@snake-evolution/github';

// With GitHub token (recommended)
const grid = await fetchContributions('username', process.env.GITHUB_TOKEN, 2025);

// Without token (public scraping)
const publicGrid = await fetchPublicContributions('username', 2025);
```

## API

| Function | Description |
|----------|-------------|
| `fetchContributions(username, token?, year?)` | Smart fetch – uses GraphQL if token provided |
| `fetchPublicContributions(username, year?)` | Always uses HTML scraping (no auth) |

## Response Format

```typescript
interface ContributionGrid {
  username: string;
  year: number;
  totalContributions: number;
  weeks: GitHubContribution[][];  // 53 weeks × 7 days
}

interface GitHubContribution {
  date: string;       // "2025-01-01"
  count: number;      // 0-N contributions
  level: 0 | 1 | 2 | 3 | 4;  // Visual intensity
}
```

## Related Packages

- [`@snake-evolution/types`](../types) – Shared TypeScript types
- [`@snake-evolution/engine`](../engine) – Simulation engine
