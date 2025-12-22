---
title: GitHub Action
description: How to use the Snake Evolution GitHub Action.
---

# GitHub Action

The Snake Evolution GitHub Action automatically generates and updates your contribution snake animation.

## Basic Usage

```yaml
name: Generate Snake

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: miccy/snake-evolution@v1
        with:
          github_user_name: ${{ github.repository_owner }}
```

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `github_user_name` | GitHub username to generate snake for | Required |
| `github_token` | GitHub token for API access | `${{ github.token }}` |
| `outputs` | Output file paths (SVG only) | `dist/snake.svg` |
| `theme` | Color theme | `github-dark` |
| `year` | Contribution year | Current year |

## Output Formats

> GIF output is not available yet. Use SVG outputs until GIF rendering ships.

### Static SVG

```yaml
outputs: dist/snake.svg
```

### Multiple Outputs

```yaml
outputs: |
  dist/snake.svg
  dist/snake-dark.svg?palette=github-dark
```

## Full Example

```yaml
name: Generate Snake

on:
  schedule:
    - cron: "0 */6 * * *" # Every 6 hours
  workflow_dispatch:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Generate Snake
        uses: miccy/snake-evolution@v1
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/snake.svg
            dist/snake-dark.svg?palette=github-dark

      - name: Push to output branch
        uses: crazy-max/ghaction-github-pages@v4
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Embedding in README

```markdown
# Light mode
![Snake animation](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/snake.svg)

# Dark mode
![Snake animation](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/snake-dark.svg#gh-dark-mode-only)
```
