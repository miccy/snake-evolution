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
snake-evolution generate -u YOUR_USERNAME

# With options
snake-evolution generate -u miccy -o dist/snake.svg -t ocean

# Using npx
npx @snake-evolution/cli generate -u YOUR_USERNAME -t neon-gamer
```

### List Available Themes

```bash
snake-evolution themes
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

## Examples

```bash
# Generate with sunset theme
snake-evolution generate -u miccy -t sunset -o my-snake.svg

# Generate for a specific year
snake-evolution generate -u miccy -y 2023 -o snake-2023.svg

# Generate static (no animation)
snake-evolution generate -u miccy --static -o static-snake.svg

# With custom frame delay (slower animation)
snake-evolution generate -u miccy --frame-delay 300
```

## Version

Current version: **1.0.0-beta.1**

## License

MIT © [Miccy](https://github.com/miccy)
