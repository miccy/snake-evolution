---
"@snake-evolution/cli": patch
---

fix(ci): resolve ENOENT error and improve security

**CLI fixes:**
- Add `mkdirSync` with `recursive: true` before writing output file
- Fixes ENOENT error when output path like `dist/snake.svg` is specified
- Read version from package.json instead of hardcoding (single source of truth)

**Action fixes:**
- Output files now correctly go to `github.workspace` instead of `github.action_path`
- Fixes issue where generated SVGs weren't accessible after action completion

**Security improvements:**
- Replace `JamesIves/github-pages-deploy-action` with native bash
- Replace `stefanzweifel/git-auto-commit-action` with native bash
- Reduces supply chain attack surface by removing third-party community actions

**DX improvements:**
- Add native git pre-commit hook for automatic lint/format checks
- No additional dependencies (no Husky, no Lefthook)
- Auto-configured via `prepare` script on `bun install`
