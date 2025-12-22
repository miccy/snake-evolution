# Scripts

Utility scripts for the Snake Evolution project.

## Available Scripts

### `setup-mac.sh`

One-command setup for macOS development environment.

```bash
chmod +x scripts/setup-mac.sh
./scripts/setup-mac.sh
```

**What it does:**

1. ✅ Checks/installs **Homebrew**
2. ✅ Checks/installs **Bun**
3. ✅ Checks/installs **Docker Desktop**
4. ✅ Runs `bun install`
5. ✅ Starts Docker services

**Prerequisites:**

- macOS
- Terminal access
- Admin rights (for Homebrew)

**After running:**

1. Open http://localhost for Appwrite
2. Create account and project
3. Add API key to `.env.local`
4. Run `bun dev`

## Adding New Scripts

Place new scripts in this directory and document them here. Follow these conventions:

- Use `#!/bin/bash` shebang
- Include `set -e` for fail-fast
- Add helpful output with emoji prefixes
- Make scripts idempotent (safe to run multiple times)

## Related

- [`docker/`](../docker) – Docker development stack
- [`.github/workflows/`](../.github/workflows) – CI/CD automation
