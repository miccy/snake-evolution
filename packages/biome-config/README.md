# @snake-evolution/biome-config

Shared [Biome](https://biomejs.dev/) configuration for the Snake Evolution monorepo.

## Usage

Extend this configuration in your package's `biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.6/schema.json",
  "extends": ["@snake-evolution/biome-config"]
}
```

## What's Included

- **Linting** – TypeScript-aware rules
- **Formatting** – Consistent code style (tabs, 100 char width)
- **Import Sorting** – Automatic organization

## Related

- [Biome Documentation](https://biomejs.dev/docs/)
- [`@snake-evolution/typescript-config`](../typescript-config) – TypeScript settings
