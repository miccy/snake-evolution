<!-- cspell:ignore stefanzweifel ENOENT -->
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.4] - 2025-12-22

### Security

- **SVG Sanitization** - Replaced fragile regex-based sanitization with `isomorphic-dompurify` for robust, isomorphic SVG sanitization in both browser and server environments
- **ReDoS Fix** - Fixed polynomial regex vulnerability by replacing with O(1) string checks

### Added

- **README Files** - Added professional README.md documentation to all packages and directories:
  - `packages/engine`, `packages/renderer`, `packages/github`, `packages/types`, `packages/ui`
  - `packages/biome-config`, `packages/typescript-config`
  - `apps/api`, `docker`, `scripts`

### Changed

- **Script Consolidation** - Reduced root package.json scripts from 30 to 21:
  - `format` + `format:check` merged into `lint` (Biome handles both)
  - `quality` + `precommit` consolidated into `check`
  - `type-check` renamed to `typecheck`
  - `clean:all` merged into `clean`
- **Turbo Config** - Cleaned up unused tasks (`test:watch`, `format`, `format:check`)

### Fixed

- Removed deprecated `@types/dompurify` package (dompurify has built-in types)
- Fixed test for empty format string to correctly expect "svg" default
- Removed duplicate `SECURITY.md` from root (using `.github/SECURITY.md`)

### Removed

- `@happy-dom/global-registrator` dependency (no longer needed with isomorphic-dompurify)

## [1.2.3] - 2025-12-20

### Fixed

- **CLI npx/npm Support** - Fixed shebang bundling to enable `npx @snake-evolution/cli` execution
- Removed duplicate shebang that prevented npm package managers from running the CLI

### Changed

- CLI package is now truly standalone with zero runtime dependencies
- All dependencies bundled into single executable file

## [1.2.0] - 2025-12-19

### Changed

- **CLI:** Renamed command from `snake-evolution` to `snake` (**BREAKING CHANGE**).
- **Monorepo:** Synchronized all packages to version 1.2.0.

### Fixed

- **CLI:** Added executable permissions (`chmod +x`) to the distributed binary.

## [1.1.0] - 2025-12-18

### Fixed

- **CLI fixes:**
  - Added `mkdirSync` with `recursive: true` before writing output file to fix `ENOENT` errors when output path directory doesn't exist.
  - Fixed version reading to use `package.json` as the single source of truth instead of hardcoded values.

- **Action fixes:**
  - Output files now correctly resolve to `github.workspace` instead of `github.action_path`, ensuring generated SVGs are accessible after action completion.

### Security

- **Supply Chain Security:**
  - Replaced `JamesIves/github-pages-deploy-action` with native bash implementation.
  - Replaced `stefanzweifel/git-auto-commit-action` with native bash implementation.
  - Reduced dependencies to minimize attack surface.

### Improvements

- **DX & Documentation:**
  - Added native git pre-commit hook for automatic lint/format checks.
  - Removed Husky and Lefthook dependencies.
  - Fixed misleading claims in documentation regarding npm publish status.
  - Updated GitHub Action examples to use native bash.
  - Corrected theme count documentation.



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
