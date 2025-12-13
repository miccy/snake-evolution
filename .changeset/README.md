# Changesets

This folder contains changeset files that describe upcoming changes.

## Workflow

### For Contributors

When making changes to packages that affect users:

1. Run `bun changeset` (or `bunx changeset`)
2. Select the affected package(s)
3. Choose bump type: `patch` (bug fix), `minor` (new feature), `major` (breaking)
4. Write a concise description of the change

### For Maintainers

When ready to release:

1. Merge the Release PR created by the GitHub Action
2. Packages will be automatically published to npm

## Package Groups

- **Core packages** (engine, renderer, types, github): Versioned together
- **CLI**: Independent versioning, published to npm
- **Config packages**: Ignored (biome-config, typescript-config)

## Commands

```bash
# Add a changeset
bun changeset

# Check status
bun changeset status

# Version packages (CI only)
bun changeset version

# Publish (CI only)
bun changeset publish
```
