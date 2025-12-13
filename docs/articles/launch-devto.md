---
title: I Built a Snake Game That Eats Your GitHub Contributions 🐍
published: false
description: Turn your GitHub contribution graph into an epic snake animation - and soon, compete with friends in PvP battles!
tags: opensource, github, typescript, gamedev
cover_image: https://raw.githubusercontent.com/miccy/snake-evolution/main/.github/banner.png
---

# I Built a Snake Game That Eats Your GitHub Contributions 🐍

Remember that classic snake game on old Nokia phones? I've reimagined it for the GitHub era. **Your contributions become the food, and the snake grows as it devours them!**

![Snake eating contributions](https://raw.githubusercontent.com/miccy/snake-evolution/output/snake.svg)

## Why I Built This

I saw [Platane's original snake generator](https://github.com/Platane/snk) and loved it. But I wanted more:

- ✨ **Multiple themes** - not just GitHub green
- 🎯 **Smarter pathfinding** - hunt high-value contributions first
- 🏆 **Coming soon: PvP mode** - compete with friends!

## How It Works

The snake uses **priority-based pathfinding**:

1. First, it hunts **darkest green** cells (most contributions)
2. Then medium, then light
3. This creates a dynamic, criss-crossing pattern instead of boring left-to-right

```typescript
// Priority hunting: level 4 → 3 → 2 → 1
for (let targetLevel = 4; targetLevel >= 1; targetLevel--) {
  const result = findPathToLevel(grid, snake, targetLevel);
  if (result) return result;
}
```

## Self-Recovery Mechanism

What happens when the snake gets stuck? It **shrinks**!

```typescript
// If stuck, shrink until we can move
while (!direction && snake.length > 1) {
  snake = shrinkSnake(snake);
  direction = findNextDirection(grid, snake);
}
```

This guarantees **100% completion** - even on completely full contribution graphs!

## Try It Yourself

### Option 1: GitHub Action (Automated)

Add this to `.github/workflows/snake.yml`:

```yaml
name: Generate Snake

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: miccy/snake-evolution@main
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: dist/snake.svg
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: '🐍 Update snake'
```

Then in your README:

```markdown
![Snake](./dist/snake.svg)
```

### Option 2: CLI

```bash
git clone https://github.com/miccy/snake-evolution.git
cd snake-evolution
bun install
bun run generate -u YOUR_USERNAME -o snake.svg
```

## Available Themes

| Theme | Description |
|-------|-------------|
| `github-dark` | GitHub's dark mode (default) |
| `github-light` | Classic GitHub light |
| `ocean` | Cool blue tones |
| `sunset` | Warm orange/pink gradient |
| `neon-gamer` | Vibrant purple/green |
| `glass` | iOS-style liquid glass |

## 🎮 Coming Soon: PvP Mode

This is where it gets exciting. I'm building **competitive snake battles**:

- **Leaderboards** - Global rankings
- **Challenge friends** - Send battle invites
- **Team battles** - Company vs company (B2B)
- **Power-ups** - Shrink, speed boost, teleport, shield
- **Each round gets harder** - Faster speed, longer snake

### Scoring System

| Contribution Level | Points |
|-------------------|--------|
| Light green | 1 |
| Medium green | 2 |
| Dark green | 3 |
| Darkest green | 5 |

Round multipliers: 1x → 1.5x → 2x → 3x → 5x

**Skill matters more than contribution count** - someone with fewer commits can beat a heavy contributor with better reflexes!

## Tech Stack

- **Bun** - Fast JavaScript runtime
- **TypeScript** - Type safety
- **SMIL Animations** - Smooth SVG animations
- **Turborepo** - Monorepo management

## Contribute

The project is open source! Check out:

- 🐛 [Report bugs](https://github.com/miccy/snake-evolution/issues)
- 💡 [Request features](https://github.com/miccy/snake-evolution/issues)
- 🔧 [Contribute code](https://github.com/miccy/snake-evolution/blob/main/CONTRIBUTING.md)

## Links

- **GitHub**: [github.com/miccy/snake-evolution](https://github.com/miccy/snake-evolution)
- **Roadmap**: [docs/ROADMAP.md](https://github.com/miccy/snake-evolution/blob/main/docs/ROADMAP.md)

---

⭐ **Star the repo** if you find it useful! And let me know in the comments - would you play PvP snake against your coworkers? 😄
