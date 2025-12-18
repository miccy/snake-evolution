# @snake-evolution/cli

> Generate GitHub contribution snake animations from the command line.

## Installation

### Zero Install (Recommended)

```bash
npx @snake-evolution/cli generate -u YOUR_USERNAME -o snake.svg
```

### Global Install

```bash
npm install -g @snake-evolution/cli
```

### As Dev Dependency

```bash
npm install -D @snake-evolution/cli
# or
bun add -d @snake-evolution/cli
```

## Usage

### Generate Animation

```bash
# Basic usage
snake generate -u YOUR_USERNAME

# With options
snake generate -u miccy -o dist/snake.svg -t ocean

# Using npx
npx @snake-evolution/cli generate -u YOUR_USERNAME -t neon-gamer
```

### List Available Themes

```bash
snake themes
```

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `-u, --username <name>` | GitHub username | *required* |
| `-o, --output <path>` | Output file path | `snake.svg` |
| `-t, --theme <name>` | Color theme | `github-dark` |
| `-y, --year <year>` | Year to generate | current year |
| `-f, --format <format>` | Output format (svg, gif) | `svg` |
| `--static` | Generate static SVG (no animation) | `false` |
| `--frame-delay <ms>` | Delay between frames | `150` |
| `--token <token>` | GitHub token for higher rate limits | - |

## Available Themes

| Theme | Description |
|-------|-------------|
| `github-dark` | GitHub's dark mode (default) |
| `github-light` | Classic GitHub light theme |
| `ocean` | Cool blue ocean tones |
| `sunset` | Warm sunset vibes |
| `neon-gamer` | Vibrant neon purple/green |
| `cypherpunk` | Blue/magenta cyberpunk vibes |
| `glass` | Liquid glass effect (requires GIF output, coming soon) |

## Examples

```bash
# Custom year
snake generate -u miccy -y 2024

# Multiple outputs
snake generate -u miccy -o snake-dark.svg -t github-dark
snake generate -u miccy -o snake-light.svg -t github-light

# Generate static (no animation)
snake generate -u miccy --static -o static-snake.svg

# With custom frame delay (slower animation)
snake generate -u miccy --frame-delay 300
```

## Common Use Cases

### Profile README

Add an animated snake to your GitHub profile:

```yaml
# .github/workflows/snake.yml
name: Generate Snake

on:
  schedule:
    - cron: "0 0 * * *"  # Daily at midnight
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: npx @snake-evolution/cli@latest generate -u ${{ github.repository_owner }} -o dist/snake.svg
      - # ... commit and push dist/snake.svg
```

### Documentation Sites

Generate static snapshots for documentation:

```bash
# Generate static SVG (single frame)
snake generate -u YOUR_USERNAME --static -o docs/contribution-graph.svg
```

### Presentations & Articles

Create theme-matched visuals:

```bash
# Light theme for presentations
snake generate -u YOUR_USERNAME -t github-light -o slides/contributions.svg

# Dark theme for dev.to articles
snake generate -u YOUR_USERNAME -t ocean -o article/snake-animation.svg
```

## Troubleshooting

### Rate Limits

If you hit GitHub's rate limit:

```bash
# Use a GitHub token for higher limits
snake generate -u YOUR_USERNAME --token ghp_YOUR_TOKEN

# Or wait and try again (public API allows 60 req/hour)
```

### Permission Errors

If you get `ENOENT` or permission errors:

```bash
# Ensure output directory exists
mkdir -p dist
snake generate -u YOUR_USERNAME -o dist/snake.svg

# Check file permissions
ls -la dist/
```

### npx/bunx Issues

If `npx` or `bunx` fails to find the command:

```bash
# Clear npm cache
npm cache clean --force

# Try with specific version
npx @snake-evolution/cli@latest generate -u YOUR_USERNAME

# Or install globally
npm install -g @snake-evolution/cli
snake generate -u YOUR_USERNAME
```

### Theme Not Rendering

Glass theme requires GIF output (coming in v1.3):

```bash
# Use alternative themes for SVG
snake generate -u YOUR_USERNAME -t cypherpunk -o snake.svg
```

## Version

Current version: **1.2.3**

## License

MIT © [Miccy](https://github.com/miccy)
