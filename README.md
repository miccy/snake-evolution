<p align="center">
  <img src=".github/banner.jpg" alt="Snake Evolution" width="100%">
</p>

<h1 align="center">🐍 Snake Evolution</h1>

<p align="center">
  <strong>Turn your GitHub contributions into an animated snake that devours them!</strong>
</p>

<p align="center">
  <a href="https://github.com/miccy/snake-evolution/stargazers"><img src="https://img.shields.io/github/stars/miccy/snake-evolution?style=for-the-badge&logo=github&color=yellow" alt="Stars"></a>
  <a href="https://www.npmjs.com/package/@snake-evolution/cli"><img src="https://img.shields.io/npm/v/@snake-evolution/cli?style=for-the-badge&logo=npm&color=red" alt="npm"></a>
  <a href="https://www.npmjs.com/package/@snake-evolution/cli"><img src="https://img.shields.io/npm/dm/@snake-evolution/cli?style=for-the-badge&logo=npm&color=red" alt="downloads"></a>
  <a href="https://github.com/miccy/snake-evolution/releases"><img src="https://img.shields.io/github/v/release/miccy/snake-evolution?style=for-the-badge&logo=github&color=green" alt="release"></a>
  <a href="https://github.com/miccy/snake-evolution/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License"></a>
  <a href="https://github.com/miccy/snake-evolution/actions"><img src="https://img.shields.io/github/actions/workflow/status/miccy/snake-evolution/ci.yml?style=for-the-badge&logo=github-actions&logoColor=white" alt="CI"></a>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-themes">Themes</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#-cli">CLI</a> •
  <a href="#-coming-soon-pvp-mode">PvP Mode</a>
</p>

---

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/examples/github-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/examples/github-light.svg">
    <img alt="Snake eating contributions" src="./assets/examples/github-dark.svg" width="100%">
  </picture>
</p>

---

## ⚡ Quick Start

**Using npx (zero-install):**

```bash
npx @snake-evolution/cli@latest generate -u YOUR_USERNAME
```

**Using GitHub Action:**

See [🤖 GitHub Action](#-github-action) section below.

**Local development:**

```bash
git clone https://github.com/miccy/snake-evolution.git
cd snake-evolution
bun install
npx @snake-evolution/cli generate -u YOUR_USERNAME -o snake.svg
```

---

## ✨ Why Snake Evolution?

- **🎨 7 Beautiful Themes** - Match your profile's aesthetic
- **🧠 Smart Pathfinding** - Snake hunts high-value contributions first
- **⚡ Zero-Install CLI** - `npx @snake-evolution/cli@latest` - no setup needed
- **🤖 GitHub Action** - Automated daily updates
- **📦 Full Monorepo** - Engine, renderer, and themes are separate packages
- **🎯 Production Ready** - Used by developers worldwide

## 🎨 Showcase

Explore all available themes:

````carousel
![GitHub Dark Theme](./assets/examples/github-dark.svg)
<!-- slide -->
![Ocean Theme](./assets/examples/ocean.svg)
<!-- slide -->
![Sunset Theme](./assets/examples/sunset.svg)
<!-- slide -->
![Neon Gamer Theme](./assets/examples/neon-gamer.svg)
<!-- slide -->
![CypherPunk Theme](./assets/examples/cypherpunk.svg)
````

**Real-world examples:**

- 💼 Portfolio README animations
- 📚 Documentation sites with contribution graphs
- 🎤 Conference presentation slides
- ✍️ Technical articles and blog posts

---

## 🎨 Themes

### 🌑 GitHub Dark (Default)

![GitHub Dark](./assets/examples/github-dark.svg)

### ☀️ GitHub Light

![GitHub Light](./assets/examples/github-light.svg)

### 🌊 Ocean

![Ocean](./assets/examples/ocean.svg)

### 🌅 Sunset

![Sunset](./assets/examples/sunset.svg)

### 🎮 Neon Gamer

![Neon Gamer](./assets/examples/neon-gamer.svg)

### 🔵 Cypherpunk

![Cypherpunk](./assets/examples/cypherpunk.svg)

### 🧊 Glass (GIF only)

> ⚠️ **Note:** Glass theme uses blur/transparency effects that require GIF output. SVG cannot render these effects properly.

*Coming with GIF support in v1.1*

```bash
bun run generate -u YOUR_USERNAME -t ocean -o snake.svg
```

---

## 🤖 GitHub Action

Add to your profile README repository:

**`.github/workflows/snake.yml`**

```yaml
name: Generate Snake

on:
  schedule:
    - cron: "0 0 * * *" # Daily
  workflow_dispatch:
  push:
    branches: [main]

jobs:
  generate:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - uses: miccy/snake-evolution@v1
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: dist/snake.svg
          theme: github-dark

      - name: Commit and Push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add dist/*.svg
          git diff --staged --quiet || git commit -m "🐍 Update snake"
          git push
```

Then in your **README.md**:

```markdown
![Snake](./dist/snake.svg)
```

---

## 💻 CLI

[![npm version](https://img.shields.io/npm/v/@snake-evolution/cli)](https://www.npmjs.com/package/@snake-evolution/cli)
[![npm downloads](https://img.shields.io/npm/dm/@snake-evolution/cli)](https://www.npmjs.com/package/@snake-evolution/cli)

### Zero-Install (Recommended)

No installation required! Use `npx` or `bunx`:

```bash
# Using npx
npx @snake-evolution/cli@latest generate -u YOUR_USERNAME

# Using bunx (faster)
bunx @snake-evolution/cli@latest generate -u YOUR_USERNAME

# With custom options
npx @snake-evolution/cli@latest generate -u YOUR_USERNAME -t ocean -o snake.svg
```

### Global Installation

```bash
# Using npm
npm install -g @snake-evolution/cli

# Using bun
bun add -g @snake-evolution/cli

# Then use anywhere
snake generate -u YOUR_USERNAME
snake themes  # List available themes
```

### Local Project

```bash
npm install @snake-evolution/cli
# or
bun add @snake-evolution/cli
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-u, --username` | GitHub username | *required* |
| `-o, --output` | Output file path | `snake.svg` |
| `-t, --theme` | Color theme | `github-dark` |
| `-y, --year` | Year to generate | current |
| `--static` | Static SVG (final frame with snake) | `false` |

---

## 🎮 Coming Soon: PvP Mode

<p align="center">
  <img src="https://img.shields.io/badge/STATUS-COMING%20SOON-ff6b6b?style=for-the-badge" alt="Coming Soon">
</p>

**Challenge your friends to snake battles!**

- 🏆 **Leaderboards** - Global rankings
- ⚔️ **1v1 Challenges** - Battle friends
- 👥 **Team Battles** - Company vs company
- ⚡ **Power-ups** - Shrink, teleport, shield
- 📈 **Progressive rounds** - Gets faster each level!

[📍 View Roadmap →](./docs/ROADMAP.md)

---

## 🏗️ Development

```bash
git clone https://github.com/miccy/snake-evolution.git
cd snake-evolution
bun install
bun run generate -u YOUR_USERNAME -o test.svg
```

---

## 🤝 Contributing

We love contributions! See [CONTRIBUTING.md](.github/CONTRIBUTING.md)

- 🐛 [Report bugs](https://github.com/miccy/snake-evolution/issues)
- 💡 [Request features](https://github.com/miccy/snake-evolution/issues)
- 🎨 [Submit new themes](https://github.com/miccy/snake-evolution/pulls)

---

## 💖 Support

<p align="center">
  <a href="https://github.com/sponsors/miccy">
    <img src="https://img.shields.io/badge/Sponsor-❤️-ea4aaa?style=for-the-badge&logo=github-sponsors" alt="Sponsor">
  </a>
</p>

If you find this useful:

- ⭐ **Star this repo** - It helps a lot!
- 🐦 **Share on Twitter/X** - Spread the word
- 💬 **Join Discussions** - Ideas and feedback

---

## 📄 License

MIT © [Miccy](https://github.com/miccy)

Original snake concept by [Platane](https://github.com/Platane) 🙏

---

<p align="center">
  <a href="https://github.com/miccy/snake-evolution">
    <img src="https://img.shields.io/badge/⭐_Star_this_repo-yellow?style=for-the-badge&logo=github" alt="Star">
  </a>
</p>

<p align="center">
  <sub>Built with 🐍 by <a href="https://github.com/miccy">@miccy</a></sub>
</p>
