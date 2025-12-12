# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-12

### 🎉 Initial Release

First public release of Snake Evolution - a GitHub contribution snake generator.

### Added

- **CLI Tool** - Generate snake animations from command line
  - Multiple themes: github-dark, github-light, ocean, sunset, neon-gamer, glass
  - Customizable output path and year
  - Support for GitHub token (optional, uses public scraping as fallback)

- **GitHub Action** - Automated snake generation in your workflow
  - Easy integration with profile README
  - Automatic daily regeneration
  - Multiple theme support

- **Engine** - Smart snake pathfinding
  - Priority-based hunting (highest contribution levels first)
  - Self-collision avoidance
  - Dynamic growth based on contribution count
  - Shrinking recovery when stuck

- **Renderer** - High-quality SMIL animations
  - Smooth movement with linear interpolation
  - Visual gradient: larger head, smaller tail, opacity fade
  - Precise cell disappearance timing
  - Loop-friendly animations

### Themes

- `github-light` - GitHub's default light theme
- `github-dark` - GitHub's dark mode
- `ocean` - Cool blue tones
- `sunset` - Warm orange and pink gradient
- `neon-gamer` - Vibrant purple and green
- `glass` - iOS-style liquid glass effect

### Credits

- Original snake concept by [Platane](https://github.com/Platane)
- Built with ❤️ by [@miccy](https://github.com/miccy)
