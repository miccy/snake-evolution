# v1.2.0 - Snake CLI Rename & Fixes

This release introduces a simpler CLI command and fixes the executable permissions issue.

## ⚠️ Breaking Changes

- **CLI Command Renamed:** The command has been changed from `snake-evolution` to **`snake`** for brevity.
  - Old: `snake-evolution generate -u miccy`
  - New: `snake generate -u miccy`

## 🐛 Bug Fixes

- **Binary Permissions:** Fixed permissions on the valid executable (`chmod +x`), resolving the `EACCES` or "invalid bin" error when running the CLI globally.
- **Path Resolution:** Fixed `ENOENT` errors by ensuring output directories are created recursively.
- **Versioning:** CLI now correctly reads its version from `package.json` instead of a hardcoded internal value.

## 📦 Monorepo

- All packages (`@snake-evolution/engine`, `@snake-evolution/renderer`, etc.) have been synchronized to version **1.2.0**.

## 🚀 Installation/Update

To install the new version:

```bash
npm install -g @snake-evolution/cli
# or
bun add -g @snake-evolution/cli
```

Verify installation:
```bash
snake --version
# Should output 1.2.0
```
