# Release Setup & Process

This document outlines the steps to release new versions of Snake Evolution packages.

## Prerequisites

- **GitHub Repository Settings**: Ensure `Allow auto-merge` is enabled.
- **Secrets**: `NPM_TOKEN` must be set in GitHub Actions secrets.
- **Permissions**: You need write access to the repository and npm organization.

## Step 1: Create Changesets

When making changes, generate a changeset file to document them:

```bash
bun changeset
```

Select the affected packages and write a summary.

## Step 2: Push Changes

Commit the changeset file along with your code changes.

```bash
git add .
git commit -m "feat: my cool feature"
git push
```

## Step 3: Create Release Pull Request

When `main` has new changesets, the "Release" GitHub Action will automatically create a "Release Packages" PR.

## Step 4: Verify Release

1.  Review the Release PR.
2.  Ensure tests pass in CI.
3.  Check the CHANGELOG updates.

## Step 5: Merge and Publish

Merge the Release PR. The GitHub Action will detect the merge, create a git tag for the release, build the packages, and publish them to npm.

*Key actions:* `git tag`, `release` workflow.

## Verification Checklist

- [ ] All tests passed
- [ ] Documentation updated
- [ ] Changelog is correct
