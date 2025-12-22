---
title: Quick Start
description: Get your GitHub contribution snake up and running in minutes.
---

# Quick Start

Get your animated contribution snake in just a few steps!

## Option 1: GitHub Action (Recommended)

The easiest way to use Snake Evolution is through our GitHub Action.

### 1. Create the workflow file

Create `.github/workflows/snake.yml` in your profile repository:

```yaml
name: Generate Snake

on:
  schedule:
    - cron: "0 0 * * *" # Every day at midnight
  workflow_dispatch: # Manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: miccy/snake-evolution@v1
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/snake.svg
            dist/snake-dark.svg?palette=github-dark

      - uses: actions/upload-artifact@v4
        with:
          name: snake-animations
          path: dist/
```

### 2. Add to your README

```markdown
![Snake animation](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/snake.svg)
```

### 3. Run the workflow

Go to Actions → Generate Snake → Run workflow

## Option 2: Web Playground

Visit [snake-evolution.dev/playground](https://snake-evolution.dev/playground) to:

1. Enter your GitHub username
2. Choose a color palette
3. Preview and download your animation

## Option 3: API

Make a direct API request:

```bash
curl -X POST https://api.snake-evolution.dev/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"username": "your-username", "format": "svg"}'
```

## Next Steps

- [Customize your snake](/guides/customization)
- [Explore color palettes](/guides/palettes)
- [API Reference](/reference/api)
