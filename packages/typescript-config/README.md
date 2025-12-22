# @snake-evolution/typescript-config

Shared TypeScript configurations for the Snake Evolution monorepo.

## Available Configs

| Config | Use Case |
|--------|----------|
| `base.json` | Base settings for all packages |
| `node.json` | Node.js/Bun applications |
| `react.json` | React web applications |

## Usage

Extend in your package's `tsconfig.json`:

```json
{
  "extends": "@snake-evolution/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### For React Apps

```json
{
  "extends": "@snake-evolution/typescript-config/react.json"
}
```

### For Node/Bun Packages

```json
{
  "extends": "@snake-evolution/typescript-config/node.json"
}
```

## Included Settings

- **Target**: ESNext
- **Module**: ESNext with Bundler resolution
- **Strict Mode**: Enabled
- **Interop**: esModuleInterop, allowSyntheticDefaultImports

## Related

- [`@snake-evolution/biome-config`](../biome-config) – Linting & formatting
