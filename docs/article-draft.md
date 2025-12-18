# 🐍 The Snake that Eats Your GitHub Contributions (And Why Your Profile Needs It)

> **Target Platforms:** dev.to, daily.dev, Hashnode, r/programming, Hacker News
> **Estimated Reading Time:** 7-10 minutes

## Hook: Stop Boring GitHub Profiles

Your GitHub contributions graph is **boring**.

There, I said it.

You pour hundreds of hours into code, ship features, fix bugs, and contribute to open source. But your profile just shows... green squares. Static, lifeless green squares.

**What if those squares became alive?** What if a snake hunted through your year of work, devouring your contributions in a mesmerizing animation?

That's exactly what **Snake Evolution** does.

```bash
npx @snake-evolution/cli@latest generate -u YOUR_USERNAME
```

60 seconds later, you have an animated snake eating your GitHub year. Zero configuration. Zero installation. **Maximum wow factor**.

## The Problem: GitHub Profiles Are Underutilized

GitHub profiles are the resume nobody talks about. They're the first thing:
- Recruiters check when screening candidates
- Open source maintainers see before accepting your PR
- Potential collaborators review before reaching out

Yet most profiles are default templates with a contribution graph that screams "I only code during work hours" or "I have no life" (there's no in-between).

**We needed something better.** Something that:
1. Shows off your work in an engaging way
2. Doesn't require hours of setup
3. Actually gets people to click and explore

## The Solution: Snake Evolution

Snake Evolution transforms your GitHub contributions into an animated snake that intelligently hunts and eats your work.

### Core Features

**1. Smart Pathfinding**
The snake doesn't just move randomly. It uses a priority-based algorithm to:
- Hunt the darkest green squares first (your most productive days)
- Avoid getting stuck in corners
- Shrink when trapped, then recover
- Create smooth, natural-looking movement

**2. 7 Custom Themes**
Match your profile's vibe:
- `github-dark` - Classic GitHub dark mode
- `ocean` - Cool blue tones
- `sunset` - Warm orange/pink gradient
- `neon-gamer` - Cyberpunk purple/green
- `cypherpunk` - Blue/magenta vibes
- Plus `github-light` and `glass` (GIF-only)

**3. Zero-Install CLI**
```bash
# Instant use, no setup
npx @snake-evolution/cli@latest generate -u miccy -t ocean

# Or global install
npm install -g @snake-evolution/cli
snake generate -u miccy
```

**4. GitHub Action**
Automate daily updates:
```yaml
- uses: miccy/snake-evolution@v1
  with:
    github_user_name: ${{ github.repository_owner }}
    outputs: dist/snake.svg
    theme: cypherpunk
```

## How It Works (Technical Deep Dive)

Snake Evolution is a complete TypeScript rewrite with a modern stack:

### Architecture

**Monorepo Structure:**
```
snake-evolution/
├── packages/
│   ├── engine/      # Pathfinding & simulation
│   ├── renderer/    # SMIL-based SVG animation
│   ├── github/      # Contribution data fetcher
│   ├── types/       # Shared TypeScript types
│   └── cli/         # Command-line interface
└── apps/
    └── web/         # Documentation (Astro)
```

### The Engine

The pathfinding algorithm is where the magic happens:

```typescript
// Simplified version
export function simulateSnake(grid: ContributionGrid) {
  const snake = { head: startPos, segments: [] };
  const frames = [];

  while (hasContributions(grid)) {
    // Find highest-value reachable cell
    const target = findBestTarget(grid, snake);

    // Move snake towards target
    const path = calculatePath(snake.head, target);
    snake.move(path[0]);

    // Eat contribution
    if (isOnContribution(snake.head)) {
      snake.grow();
      grid.consume(snake.head);
    }

    frames.push(captureFrame(snake, grid));
  }

  return frames;
}
```

Key innovations:
- **Priority queue** for target selection (darkest squares first)
- **Shrinking recovery** when stuck (loses tail to escape)
- **Frame optimization** (only captures meaningful state changes)

### The Renderer

SMIL (Synchronized Multimedia Integration Language) powers the animations:

```xml
<rect>
  <animate
    attributeName="fill-opacity"
    values="0;0;0;1;1;0"
    keyTimes="0;0.5;0.51;0.52;0.99;1"
    dur="30s"
    repeatCount="indefinite"
  />
</rect>
```

Benefits of SMIL:
- Native browser support (no JavaScript needed)
- Tiny file sizes (300-500KB for full year)
- Smooth 60fps animations
- Works in GitHub READMEs

## Real-World Impact

**Who's using Snake Evolution?**
- Portfolio READMEs (personal branding)
- Open source project pages (visual appeal)
- Conference presentations (live demos)
- Technical articles (contribution visualization)

**Metrics:**
- ⭐ [Current GitHub stars]
- 📦 [npm downloads/month]
- 🌍 Used in [X] countries

## Getting Started (5 Minutes)

### Option 1: Quick Try (npx)

```bash
# Generate with default theme
npx @snake-evolution/cli@latest generate -u YOUR_USERNAME

# Custom theme
npx @snake-evolution/cli@latest generate -u YOUR_USERNAME -t ocean
```

### Option 2: GitHub Action (Automated)

1. Create `.github/workflows/snake.yml`:

```yaml
name: Generate Snake

on:
  schedule:
    - cron: "0 0 * * *"  # Daily
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: miccy/snake-evolution@v1
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: dist/snake.svg
      # Commit and push dist/snake.svg
```

2. Add to your README:
```markdown
![Snake animation](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/snake.svg)
```

3. Watch it update daily ✨

## Behind the Scenes: The Stack

**Why Bun?**
- 3x faster than npm
- Built-in TypeScript support
- Native test runner
- Monorepo-first design

**Why SMIL over Canvas/GIF?**
- File size: 400KB vs 5MB+
- Quality: vector vs raster
- Compatibility: works everywhere
- Performance: GPU-accelerated

**Why Monorepo?**
- Shared types across packages
- Independent versioning
- Easier testing
- Better DX

## What's Next: The Roadmap

**v1.3 - Glass Theme GIF Support** (Q1 2025)
- Liquid glass visual effects
- Blur and transparency
- GIF output format

**v2.0 - PvP Mode** (Q2 2025)
- Two snakes compete
- Compare contribution patterns
- Multiplayer animations
- Leaderboards

**v2.5 - Custom Themes** (Q3 2025)
- Theme editor
- Community theme marketplace
- Import/export themes

## Try It Now

```bash
npx @snake-evolution/cli@latest generate -u YOUR_USERNAME -t cypherpunk
```

**Links:**
- 🌐 **Website:** https://www.npmjs.com/package/@snake-evolution/cli
- 💻 **GitHub:** https://github.com/miccy/snake-evolution
- 📚 **Docs:** https://github.com/miccy/snake-evolution#readme
- 🐛 **Issues:** https://github.com/miccy/snake-evolution/issues

## Show Your Support

If you found this useful:
- ⭐ Star the repo
- 🐦 Share on Twitter/X
- 💬 Comment with your snake!
- 🤝 Contribute a theme

---

**Built with ❤️ by [@miccy](https://github.com/miccy)**
*Inspired by the original concept by [Platane](https://github.com/Platane/snk)*

*Snake Evolution is a complete independent rewrite with new pathfinding, renderer, themes, and architecture. The only shared element is the core concept of "snake eats contributions".*
