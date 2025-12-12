# 🐍 Contributions Devouring Snake

> Transform your GitHub contribution graph into an epic snake animation that devours your contributions and grows longer!

[![GitHub Stars](https://img.shields.io/github/stars/miccy/snake-evolution?style=flat-square)](https://github.com/miccy/snake-evolution/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[🎮 Live Playground](#) | [📚 Documentation](#) | [🎨 Gallery](#) | [💬 Discord](#)

## ✨ What Makes This Different?

Unlike other GitHub snake generators, ours features:

- **🎮 Interactive Playground** - Try it instantly in your browser, no installation needed
- **🎨 10+ Visual Templates** - Neon Gamer, Minimal Pro, Matrix Hacker, and more
- **🐍 Growing Snake** - Gets longer as it devours contributions (just like the classic game!)
- **🌈 Full Customization** - Colors, growth rate, animation speed
- **💾 Local-First** - Uses Evolu for offline support and privacy
- **🎯 Share Instantly** - Auto-generated social media cards
- **🚀 Multiple Formats** - SVG, GIF, or live web component

## 🎬 See It In Action

<!-- VIDEO DEMO WILL GO HERE -->

## 🚀 Quick Start

### For GitHub Profile README

Add this to your `README.md`:

```markdown
![Snake animation](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/github-snake.svg)
```

Then set up the GitHub Action (see [GitHub Action Guide](#github-action))

### Try It Online

1. Visit [our playground](#)
2. Enter your GitHub username
3. Pick a template or customize colors
4. Download or share!

## 📦 What's Included

This monorepo contains:

### 🌐 Apps

- **[apps/web](./apps/web)** - Astro + React playground with Evolu database
- **[apps/docs](./apps/docs)** - Comprehensive documentation site (Astro Starlight)
- **[apps/action](./apps/action)** - GitHub Action for automated generation

### 📚 Packages

- **[packages/engine](./packages/engine)** - Core snake logic and pathfinding
- **[packages/renderer](./packages/renderer)** - SVG/GIF/Canvas rendering
- **[packages/github](./packages/github)** - GitHub API integration
- **[packages/cli](./packages/cli)** - Command-line tool

### 🔧 Tooling

- **[tooling/eslint-config](./tooling/eslint-config)** - Shared ESLint configuration
- **[tooling/typescript-config](./tooling/typescript-config)** - Shared TypeScript configs
- **[tooling/tailwind-config](./tooling/tailwind-config)** - Shared Tailwind configuration

## 🎨 Templates

We have 10+ pre-made visual styles:

| Template | Description | Preview |
|----------|-------------|---------|
| 🎮 Neon Gamer | Vibrant purple and green | [Preview](#) |
| ⚫ Minimal Pro | Clean black and white | [Preview](#) |
| 💚 Matrix Hacker | Green on black terminal style | [Preview](#) |
| 🌅 Sunset Vibes | Warm orange and pink gradient | [Preview](#) |
| 🌊 Ocean Deep | Cool blue tones | [Preview](#) |
| 🌈 Rainbow Party | Full spectrum colors | [Preview](#) |
| 🍂 Autumn Forest | Earth tones | [Preview](#) |
| 💜 Purple Dream | Purple gradient | [Preview](#) |
| 🌸 Cherry Blossom | Soft pink theme | [Preview](#) |
| 🔥 Fire & Ice | Red and blue contrast | [Preview](#) |

[View all templates →](#)

## 🛠️ GitHub Action

Add to `.github/workflows/snake.yml`:

```yaml
name: Generate Snake

on:
  schedule:
    - cron: "0 0 * * *" # Daily at midnight
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate Snake
        uses: miccy/snake-evolution@v1
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/github-snake.svg
            dist/github-snake-dark.svg?palette=github-dark
            dist/ocean.gif?palette=ocean&snake_length_increment=2
      
      - name: Push to output branch
        uses: crazy-max/ghaction-github-pages@v3
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

[Full GitHub Action Guide →](#)

## 💻 CLI Usage

```bash
# Install globally
bun add -g @snake/cli

# Generate snake
snake generate --username miccy --output snake.svg

# Watch mode (auto-regenerate)
snake watch --username miccy

# Batch generate for multiple users
snake batch --users miccy,platane,torvalds

# Preview in browser
snake preview --username miccy
```

[Full CLI Documentation →](#)

## 🏗️ Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.3.0 (recommended)
- [Node.js](https://nodejs.org) >= 24 (alternative)
- [Git](https://git-scm.com)

### Setup

```bash
# Clone the repository
git clone https://github.com/miccy/snake-evolution.git
cd snake-evolution

# Install dependencies
bun install

# Start development servers (all apps)
bun run dev

# Or start specific app
bun run dev:web
bun run dev:docs

# Run tests
bun test

# Build everything
bun run build

# Check code quality
bun run quality
```

### Project Structure

```
snake-evolution/
├── apps/
│   ├── web/              # Main website + playground
│   ├── docs/             # Documentation
│   └── action/           # GitHub Action
├── packages/
│   ├── engine/           # Snake engine
│   ├── renderer/         # Rendering
│   ├── github/           # GitHub API
│   └── cli/              # CLI tool
├── tooling/              # Shared configs
├── examples/             # Usage examples
└── docs/                 # Project documentation
    ├── AGENTS.md         # AI agent orchestration
    ├── ARCHITECTURE.md   # Technical architecture
    ├── ROADMAP.md        # Development roadmap
    ├── EVOLU_GUIDE.md    # Evolu integration
    └── APPWRITE_SETUP.md # Appwrite setup
```

### Tech Stack

- **Frontend**: [Astro](https://astro.build), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com)
- **Database**: [Evolu](https://evolu.dev) (local-first SQLite + CRDT)
- **Backend**: [Appwrite](https://appwrite.io) (auth, storage, functions)
- **Build**: [Turborepo](https://turbo.build), [Bun](https://bun.sh)
- **Deployment**: GitHub Pages (primary), Vercel (backup)

## 🤝 Contributing

We love contributions! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- 🎨 New visual templates
- 🔧 Code contributions

Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

### Good First Issues

Looking to contribute? Check out issues labeled [`good first issue`](https://github.com/miccy/snake-evolution/labels/good%20first%20issue)

## 📖 Documentation

- [Getting Started Guide](#)
- [API Reference](#)
- [Customization Guide](#)
- [GitHub Action Guide](#)
- [CLI Documentation](#)
- [Contributing Guide](CONTRIBUTING.md)
- [Architecture Documentation](docs/ARCHITECTURE.md)

## 🎓 Learning Resources

This project was built to learn and demonstrate:

- **Local-First Architecture** with Evolu
- **GitHub Apps Development**
- **Appwrite Integration**
- **AI Agent Orchestration**
- **Modern Monorepo Patterns**

Read about our journey:
- [Building a Local-First App with Evolu](#) (Coming soon)
- [Orchestrating AI Agents for Development](#) (Coming soon)
- [From Idea to 10k GitHub Stars](#) (Coming soon)

## 🌟 Show Your Support

If you find this project useful, please:

- ⭐ Star the repository
- 🐦 Share on Twitter
- 💬 Join our Discord
- 💰 [Sponsor on GitHub](https://github.com/sponsors/miccy)

## 📊 Project Stats

<!-- Add shields.io badges here -->

## 🙏 Acknowledgments

- Original snake concept by [Platane](https://github.com/Platane)
- Built with ❤️ by [@miccy](https://github.com/miccy)
- Community contributors (see [Contributors](https://github.com/miccy/snake-evolution/graphs/contributors))

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Website](#)
- [Documentation](#)
- [Discord Community](#)
- [Twitter](https://twitter.com/YOUR_HANDLE)
- [Blog](https://YOUR_BLOG.com)

---

<div align="center">
  <p>
    <sub>Built with 🐍 by <a href="https://github.com/miccy">@miccy</a></sub>
  </p>
  <p>
    <sub>Want to contribute? Check out <a href="CONTRIBUTING.md">CONTRIBUTING.md</a></sub>
  </p>
</div>
