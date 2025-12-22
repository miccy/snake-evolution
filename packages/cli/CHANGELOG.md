# @snake-evolution/cli

## 1.2.4

### Security

- Replaced regex-based SVG sanitization with `isomorphic-dompurify` for robust sanitization
- Fixed ReDoS vulnerability in SVG structure validation

## 1.2.3

### Patch Changes

- fix: npx/bunx compatibility - ensure CLI binary has shebang for standalone execution
  <!-- cSpell:ignore bunx -->

## 1.2.0

### Minor Changes

- feat: rename CLI command to `snake` and ensure binary has executable permissions

## 1.1.1

### Bug Fixes

- fix: ensure CLI binary has executable permissions and rename command to `snake`
