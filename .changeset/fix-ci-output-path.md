---
"@snake-evolution/cli": patch
---

fix(cli): create output directory if it doesn't exist

- Add `mkdirSync` with `recursive: true` before writing output file
- Fixes ENOENT error when output path like `dist/snake.svg` is specified
