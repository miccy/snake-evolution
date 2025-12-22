# 🗺️ Roadmap

## Vision

Make Snake Evolution the most fun way to visualize GitHub contributions - from solo animations to competitive PvP battles!

---

## ✅ v1.2.4 - Current Release (December 2025)

**What's Live:**

- ✅ CLI tool with npm support (`npx @snake-evolution/cli@latest`)
- ✅ 7 themes: github-light, github-dark, ocean, sunset, neon-gamer, cypherpunk, glass (GIF only)
- ✅ GitHub Action for automated generation
- ✅ Smart pathfinding (priority-based hunting - eats darkest squares first)
- ✅ Smooth SMIL animations with visual gradient
- ✅ Works for any GitHub user
- ✅ Zero-install via npx/bunx
- ✅ Monorepo architecture (Turborepo + Bun 1.3.5)
- ✅ Consolidated scripts (30 → 21)
- ✅ Professional README files for all packages

---

## 🚧 v1.3.0 - GIF Output & Glass Theme (January 2025)

**Focus:** GIF format, Glass theme, Bun 1.3.5 integration

### Features

- [ ] **GIF output format** (`--format gif`) - Enables embedding everywhere
- [ ] **Glass theme fully supported** - Pre-rendered blur effects in GIF
- [ ] **CLI progress indicator** - Frame rendering progress
- [ ] **Frame sampling** - Smaller files for large animations

### Technical Implementation (Research Dec 2025)

**Architecture:**

```
Static SVG → resvg-js (Rust/WASM) → gifenc (pure JS) → GIF
```

**Dependencies:**

| Library | Version | Purpose | Bun 1.3.5 |
|---------|---------|---------|-----------|
| `@resvg/resvg-js` | 2.6.2 | SVG → PNG pixels (WASM) | ✅ Full |
| `gifenc` | 1.0.3 | PNG → GIF encoding | ✅ Full |

**Why not Platane's approach:**

- ❌ `node-canvas` requires native cairo compilation
- ❌ `gifsicle` requires binary installation
- ✅ Our stack = zero native deps, works in Bun

**Glass Theme:**

- SVG blur filters too heavy for browsers
- GIF pre-renders blur → zero runtime cost
- Works everywhere: email, README, social media

### Bun 1.3.5 Features We Can Use

| Feature | Use Case |
|---------|----------|
| `CompressionStream` | Compressed GIF responses in API |
| Built-in Redis | GitHub API response caching |
| S3 support | Store generated GIFs |
| `Bun.Terminal` | Rich CLI progress display |
| Compile-time flags | Dev/prod build optimization |

---


## 🎮 v2.0 - Interactive Web Playground (Q2 2025)

**Focus:** Web app with live customization

### Core Features

- [ ] **Astro web app** with React islands
- [ ] **Live playground** - Real-time preview as you type
- [ ] **Theme customizer** - Create custom color palettes
- [ ] **Multi-format** download (SVG, GIF, PNG)
- [ ] **Share links** with custom settings
- [ ] **Evolu integration** - Save preferences locally (offline-first)

### Technical Stack

- Frontend: Astro + React 19 + Tailwind CSS 4
- Database: Evolu (local-first CRDT)
- Backend: Appwrite (auth, storage)
- Deployment: GitHub Pages + Vercel

---

## 🏆 v3.0 - PvP Mode (Q3 2025)

**Challenge your friends to a snake battle!**

### Game Mechanics

- [ ] **Leaderboards** - Global rankings by score
- [ ] **Rounds system** - Each round gets faster, snake grows
- [ ] **PvP Challenges** - Battle friends or colleagues
- [ ] **Team battles** - Company vs company (B2B feature)

### Power-ups

- 🔄 **Shrink** - Reduce snake length
- ⚡ **Speed Boost** - Temporary speed increase
- 🌀 **Teleport** - Jump to random position
- 🛡️ **Shield** - Pass through yourself once

### Scoring System

| Contribution Level | Points | Round Multiplier |
|--------------------|--------|------------------|
| Level 1 (light)    | 1 pt   | 1x → 1.5x → 2x → 3x → 5x |
| Level 2 (medium)   | 2 pts  | |
| Level 3 (dark)     | 3 pts  | |
| Level 4 (darkest)  | 5 pts  | |

---

## 🌟 Community Ideas & Under Consideration

Vote on features at [GitHub Discussions](https://github.com/miccy/snake-evolution/discussions)!

### Most Requested

- ✉️ **Email Signature Mode** - Animated GIF for email footers (high demand!)
- 🔤 **Custom Text Mode** - Type your own text (e.g., "your-name.dev") and watch snake eat it
- 📜 **Scrolling Text Mode** - Marquee-style text animation (no snake)
- 🎨 **Email Tool Integration** - Canva, Mailchimp, etc.

### Future Explorations

- 🎵 Sound effects and music
- 📱 Mobile app (React Native)
- 🤖 AI opponent mode
- 📊 Statistics dashboard
- 🏅 Achievement badges
- 🎨 Custom snake skins
- 🔌 Plugin system
- 🌐 API for third-party integrations

---

## 📅 Detailed Development Timeline

### Phase 1: Foundation ✅ (Completed)

*Week 1-2 - November 2024*

- ✅ Monorepo setup with Turborepo
- ✅ Core snake engine ported
- ✅ Pathfinding algorithms
- ✅ Basic SVG rendering
- ✅ CI/CD pipeline

### Phase 2: Web Platform 🚧 (Planned Q1 2025)

*Week 2-4 - January 2025*

- [ ] Astro landing page
- [ ] Interactive playground
- [ ] Evolu database integration
- [ ] Appwrite backend setup

### Phase 3: Gallery & Social 🚧 (Planned Q1 2025)

*Week 4-6 - February 2025*

- [ ] Community snake gallery
- [ ] Voting system
- [ ] Social sharing with OG images
- [ ] GitHub OAuth authentication

### Phase 4: Templates & Colors 🚧 (Planned Q2 2025)

*Week 6-8 - March 2025*

- [ ] 20+ visual templates
- [ ] Template browser UI
- [ ] Advanced color customization
- [ ] Real-time preview

### Phase 5: Launch 🚧 (Planned Q2 2025)

*Week 8-10 - April 2025*

- [ ] Product Hunt launch
- [ ] Dev.to article series
- [ ] Video demos and tutorials
- [ ] Press kit and outreach

---

## 💡 How to Contribute

Want to help build the future of GitHub profile visualizations?

**Priority Areas:**

- 🎨 **Design** - Theme creation, UI/UX improvements
- 🔧 **Development** - Web app (Astro + React), game mechanics
- 📚 **Documentation** - Tutorials, examples, translations
- 🌐 **Community** - Discord moderation, issue triage

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details!

---

## 📊 Success Metrics

### Current (v1.2)

- ⭐ GitHub Stars: [Current count]
- 📦 npm Downloads: [Monthly count]
- 🎨 Themes: 7
- 👥 Contributors: Growing!

### Target (End 2025)

- ⭐ 10,000+ GitHub stars
- 👤 50,000+ active users
- 🎨 100+ community templates
- 🌍 Featured in GitHub Explore

---

## 🎯 Release Schedule

```
v1.2.0  ✅  Dec 2024   Current release
v1.3.0  🚧  Q1 2025    Glass theme + GIF support
v2.0.0  🚧  Q2 2025    Web playground launch
v2.1.0  🚧  Q3 2025    Gallery & community
v3.0.0  🚧  Q4 2025    PvP Mode 🎮
```

---

<p align="center">
  <b>⭐ Star the repo to show support and stay updated!</b>
</p>

<p align="center">
  <a href="https://github.com/miccy/snake-evolution/issues/new?template=feature_request.yml">📝 Request a Feature</a> •
  <a href="https://github.com/miccy/snake-evolution/discussions">💬 Discussions</a>
</p>

---

**Last Updated:** December 18, 2024
**Maintained By:** [@miccy](https://github.com/miccy)
