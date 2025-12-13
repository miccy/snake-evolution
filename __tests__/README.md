# Snake Evolution - Test Suite Documentation

## Overview

This test suite provides comprehensive validation for the Snake Evolution project's configuration, documentation, and infrastructure files. All tests use Bun's built-in test runner with zero additional dependencies.

## Test Structure

```text
__tests__/                    # Root test directory
├── package-config.test.ts    # Package.json validation (root + CLI)
├── README.md                 # This file

.github/__tests__/            # GitHub-specific tests
├── action.test.ts            # GitHub Action (action.yml) tests
└── workflows.test.ts         # CI/CD workflow tests

.vscode/__tests__/            # VSCode configuration tests
└── vscode-config.test.ts     # Extensions, settings, tasks, launch configs

docs/__tests__/               # Documentation tests
└── documentation.test.ts     # README, ROADMAP, CONTRIBUTING validation
```

## Test Runner

Tests are executed using **Bun's built-in test runner**.

### Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test __tests__/package-config.test.ts

# Run tests in watch mode
bun test --watch

# Run with coverage
bun test --coverage
```

## Naming Conventions

- Test files: `*.test.ts` or `*.spec.ts`
- Test descriptions: Use descriptive `describe()` blocks for grouping
- Test names: Start with "should" (e.g., `should have correct version`)

## What Each Suite Verifies

| Suite | Purpose |
|-------|---------|
| `package-config.test.ts` | Package.json structure, engines, scripts, dependencies |
| `action.test.ts` | GitHub Action metadata, inputs, outputs, branding |
| `workflows.test.ts` | CI triggers, permissions, job configuration |
| `vscode-config.test.ts` | Editor settings, extensions, tasks, launch configs |
| `documentation.test.ts` | README structure, required sections, badges |

## CI Integration

Tests run automatically on:

- Push to `main` or `dev` branches
- All pull requests

Expected exit codes:

- `0` - All tests passed
- `1` - One or more tests failed

## Helpers and Utilities

- `parseJsonc()` - Helper function in VSCode tests for parsing JSON with comments
- File reading uses `beforeAll` hooks to minimize I/O operations
