# 🚀 Release Setup Guide

## Step 1: Merge PR

1. Go to [PR #1](https://github.com/miccy/snake-evolution/pull/1)
2. Review changes
3. Merge to main

## Step 2: Repository Settings

Go to **Settings → General**:

### Description

```text
🐍 Turn your GitHub contributions into an animated snake that devours them! CLI + GitHub Action. PvP mode coming soon!
```

### Topics (click "Add topics")

```text
github-action snake contributions svg animation typescript bun cli github-profile readme-profile
```

### Features (checkboxes)

- [x] Issues
- [x] Discussions
- [x] Releases
- [x] Packages (for npm)
- [x] Deployments (for future web)
- [ ] Wiki (not needed)
- [ ] Projects (optional)

### Social Preview

Upload `.github/banner.png`

## Step 3: Make Repository Public

Go to **Settings → Danger Zone → Change visibility → Make public**

## Step 4: Create npm Token

1. Go to [npm tokens page](https://www.npmjs.com/settings/YOUR_USERNAME/tokens)
2. Click "Generate New Token" → "Classic Token"
3. Select "Publish" permission
4. Copy the token

## Step 5: Add npm Token to GitHub Secrets

1. Go to repo **Settings → Secrets and variables → Actions**
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: paste your npm token
5. Save

## Step 6: Create Release & Publish

```bash
# Pull latest main
git checkout main
git pull origin main

# Create version tag
git tag v1.0.0
git push origin v1.0.0
```

Then on GitHub:

1. Go to **Releases → Draft a new release**
2. Choose tag: `v1.0.0`
3. Title: `v1.0.0 - Initial Release`
4. Description: Copy from CHANGELOG.md
5. Click **Publish release**

This will automatically:

- ✅ Create GitHub Release
- ✅ Trigger npm publish workflow
- ✅ Package will be available as `npx @snake-evolution/cli`

## Step 7: Publish Action to Marketplace

1. Go to **repo → Actions tab**
2. Look for "Publish this action to the GitHub Marketplace" banner
3. Follow the steps

## Step 8: Enable Discussions

Go to **Settings → Features → Discussions ✅**

Create categories:

- 💡 Ideas
- 🙋 Q&A
- 🎉 Show and Tell

---

## Verification

After release, test:

```bash
npx @snake-evolution/cli generate -u miccy -o test.svg
```

Check:

- [ ] npm page: [@snake-evolution/cli on npm](https://www.npmjs.com/package/@snake-evolution/cli)
- [ ] GitHub Action in Marketplace
- [ ] README renders correctly
- [ ] Social preview shows banner
