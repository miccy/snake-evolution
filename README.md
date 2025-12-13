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
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/miccy/snake-evolution/output/snake.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/miccy/snake-evolution/output/snake-light.svg">
    <img alt="Snake eating contributions" src="https://raw.githubusercontent.com/miccy/snake-evolution/output/snake.svg" width="100%">
  </picture>
</p>

---

## ⚡ Quick Start

**One command, zero install:**

```bash
npx @snake-evolution/cli generate -u YOUR_USERNAME -o snake.svg
```

That's it! Open `snake.svg` and watch the magic 🎉

> 💡 **Tip:** CLI accepts any output path. GitHub Actions typically use `dist/snake.svg` for file organization.

---

## ✨ Why Snake Evolution?

| Feature | Snake Evolution | Others |
|---------|-----------------|--------|
| 🧠 Smart pathfinding | ✅ Hunts high-value contributions first | ❌ Random/linear |
| 🐍 Growing snake | ✅ Gets longer as it eats | ❌ Static size |
| 🎨 Multiple themes | ✅ 5 beautiful themes | ❌ 1-2 themes |
| 📦 Zero install | ✅ `npx` just works | ⚠️ Requires setup |
| 🎮 PvP Mode | 🔜 Coming soon! | ❌ Not planned |

---

## 🎨 Themes

<table>
<tr>
<td align="center"><strong>🌑 github-dark</strong><br><sub>Default</sub></td>
<td align="center"><strong>☀️ github-light</strong><br><sub>Classic</sub></td>
<td align="center"><strong>🌊 ocean</strong><br><sub>Cool blues</sub></td>
</tr>
<tr>
<td align="center"><strong>🌅 sunset</strong><br><sub>Warm vibes</sub></td>
<td align="center"><strong>🎮 neon-gamer</strong><br><sub>Purple & green</sub></td>
<td align="center"><strong>🔜 More coming!</strong><br><sub>PRs welcome</sub></td>
</tr>
</table>

```bash
npx @snake-evolution/cli generate -u YOUR_USERNAME -t ocean -o snake.svg
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
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: '🐍 Update snake'
```

Then in your **README.md**:

```markdown
![Snake](./dist/snake.svg)
```

---

## 💻 CLI

### Zero Install (Recommended)

```bash
npx @snake-evolution/cli generate -u YOUR_USERNAME -o snake.svg
```

### Global Install

```bash
npm install -g @snake-evolution/cli
snake-evolution generate -u miccy -o snake.svg
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-u, --username` | GitHub username | *required* |
| `-o, --output` | Output file path | `snake.svg` |
| `-t, --theme` | Color theme | `github-dark` |
| `-y, --year` | Year to generate | current |
| `--static` | No animation | `false` |

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
