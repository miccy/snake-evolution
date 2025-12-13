# Contributing to Snake Evolution / Přispívání do Snake Evolution

<span aria-hidden="true">🐍</span>

**Languages / Jazyky:** [🇬🇧 English](#english) | [🇨🇿 Čeština](#čeština)

---

## English

First off, thank you for considering contributing! This project exists because of people like you.

## 🎯 How Can I Contribute?

There are many ways to contribute:

- 🐛 **Report bugs** - Help us improve
- 💡 **Suggest features** - Share your ideas
- 📝 **Improve documentation** - Make it clearer
- 🎨 **Create templates** - Design new visual styles
- 🔧 **Submit code** - Fix bugs or add features
- 🌍 **Translate** - Help us go global
- 💬 **Help others** - Answer questions in discussions

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.3.0 (primary) or [Node.js](https://nodejs.org) >= 22
- [Git](https://git-scm.com)
- [Docker](https://docker.com) (for local backend)
- GitHub account

### Setup Development Environment

```bash
# 1. Fork the repository
# Click "Fork" on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/snake-evolution.git
cd snake-evolution

# 3. Add upstream remote
git remote add upstream https://github.com/miccy/snake-evolution.git

# 4. Install dependencies
bun install

# 5. Start Docker services (optional, for backend)
docker compose -f docker/docker-compose.yml up -d

# 6. Create a branch
git checkout -b feature/your-feature-name

# 7. Start development
bun run dev
```

## 📋 Development Workflow

### 1. Pick an Issue

- Browse [open issues](https://github.com/miccy/snake-evolution/issues)
- Look for [`good first issue`](https://github.com/miccy/snake-evolution/labels/good%20first%20issue) label
- Comment on the issue to claim it
- Wait for assignment (prevents duplicate work)

### 2. Create a Branch

```bash
# Feature branches
git checkout -b feature/add-new-template

# Bug fix branches
git checkout -b fix/rendering-issue

# Documentation branches
git checkout -b docs/improve-readme
```

### 3. Make Your Changes

Follow our coding standards:

**TypeScript**:

```typescript
// Use descriptive names
function generateSnakeAnimation(options: SnakeOptions): Animation {
  // ...
}

// Add JSDoc comments for public APIs
/**
 * Renders a snake animation with custom colors
 * @param grid - GitHub contribution grid
 * @param options - Rendering options
 * @returns Rendered SVG or GIF
 */
export async function renderSnake(
  grid: ContributionGrid,
  options: RenderOptions
): Promise<Buffer>
```

**File Organization**:

```text
packages/engine/src/
├── types/          # Type definitions
├── operations/     # Pure functions
├── utils/          # Helper functions
└── index.ts        # Public API
```

**Naming Conventions**:

- Files: `camelCase.ts` or `PascalCase.tsx`
- Functions: `camelCase()`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

### 4. Write Tests

Every change should include tests:

```typescript
// packages/engine/__tests__/snake.test.ts
import { describe, it, expect } from 'vitest'
import { growSnake } from '../src/operations/growSnake'

describe('growSnake', () => {
  it('should increase snake length by growth amount', () => {
    const snake = createSnake([{ x: 0, y: 0 }])
    const grown = growSnake(snake, 3)

    expect(getSnakeLength(grown)).toBe(4)
  })

  it('should handle zero growth', () => {
    const snake = createSnake([{ x: 0, y: 0 }])
    const result = growSnake(snake, 0)

    expect(result).toEqual(snake)
  })
})
```

Run tests:

```bash
# Run all tests
bun test

# Run specific test file
bun test snake.test.ts

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

### 5. Format and Lint

```bash
# Format code
bun run format

# Check formatting
bun run format:check

# Lint code
bun run lint

# Type check
bun run type-check

# Run all quality checks
bun run quality
```

### 6. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <subject>

git commit -m "feat(renderer): add neon glow effect"
git commit -m "fix(engine): prevent snake self-collision"
git commit -m "docs(readme): add CLI usage examples"
git commit -m "test(solver): add pathfinding tests"
git commit -m "chore(deps): update dependencies"
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, etc.)
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Scopes** (examples):

- `engine`: Core snake logic
- `renderer`: Rendering system
- `web`: Web application
- `docs`: Documentation site
- `action`: GitHub Action
- `cli`: CLI tool

### 7. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Fill out the PR template
```

## 🎨 Creating Templates

Want to add a new visual template? Here's how:

### 1. Design Your Template

```typescript
// packages/renderer/src/colors/templates.ts

export const TEMPLATES = {
  // ... existing templates

  'your-template-name': {
    name: 'Your Template Name',
    description: 'Brief description of the aesthetic',
    palette: {
      empty: '#f0f0f0',      // Empty cells
      level1: '#ffb3ba',     // Low contribution
      level2: '#ffdfba',     // Medium-low
      level3: '#ffffba',     // Medium
      level4: '#baffc9',     // High
      level5: '#bae1ff',     // Very high
    },
    snake: {
      color: '#ff6b6b',      // Snake color
      gradient: true,         // Use gradient?
      glow: true,            // Add glow effect?
      trail: false,          // Show trail?
    },
    background: {
      color: '#1a1a1a',      // Background
      pattern: 'dots',       // Optional pattern
    },
    animation: {
      speed: 'normal',       // slow | normal | fast
      easing: 'ease-in-out', // CSS easing
    },
    tags: ['neon', 'colorful', 'modern'],
  },
}
```

### 2. Create Preview

```bash
# Generate preview image
bun run generate-preview your-template-name

# This creates: apps/web/public/templates/your-template-name.png
```

### 3. Add Tests

```typescript
// packages/renderer/__tests__/templates.test.ts
describe('Your Template Name', () => {
  it('should render correctly', async () => {
    const result = await renderWithTemplate('your-template-name', mockData)
    expect(result).toBeDefined()
  })

  it('should match visual snapshot', async () => {
    const result = await renderWithTemplate('your-template-name', mockData)
    expect(result).toMatchSnapshot()
  })
})
```

### 4. Submit PR

Include in PR description:

- Screenshot of the template
- Description of the aesthetic
- Inspiration (if any)
- Suggested use cases

## 📝 Documentation

### Improving Documentation

- Fix typos and unclear explanations
- Add examples and code snippets
- Create tutorials and guides
- Add diagrams and visualizations

### Documentation Structure

```
docs/
├── ARCHITECTURE.md    # Technical architecture
├── ROADMAP.md         # Development roadmap
├── EVOLU_GUIDE.md     # Evolu integration
├── APPWRITE_SETUP.md  # Appwrite setup
└── AGENTS.md          # AI agent orchestration

apps/docs/
└── src/content/docs/
    ├── getting-started/
    ├── guides/
    ├── reference/
    └── examples/
```

### Writing Style

- Use clear, simple language
- Include code examples
- Add screenshots/GIFs
- Link to related docs
- Keep it up-to-date

## 🐛 Reporting Bugs

### Before Submitting

1. Check [existing issues](https://github.com/miccy/snake-evolution/issues)
2. Try the latest version
3. Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

## 💡 Suggesting Features

### Before Submitting

1. Check if it's already suggested
2. Consider if it fits the project scope
3. Think about implementation

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you thought about.

**Additional context**
Mockups, examples, or other context.
```

## 🎯 Pull Request Process

### Before Submitting PR

- [ ] Tests pass (`bun test`)
- [ ] Code is formatted (`bun run format`)
- [ ] No lint errors (`bun run lint`)
- [ ] Types are correct (`bun run type-check`)
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated (for features)

### PR Template

```markdown
**Description**
What does this PR do?

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
How did you test this?

**Checklist**
- [ ] Tests pass
- [ ] Code formatted
- [ ] No lint errors
- [ ] Types correct
- [ ] Docs updated

**Screenshots** (if applicable)

**Related Issues**
Closes #123
```

### Review Process

1. Maintainer reviews your PR
2. Address feedback if needed
3. PR is approved
4. PR is merged
5. Changes appear in next release

## 🏆 Recognition

Contributors are recognized in:

- [README.md](README.md) contributors section
- GitHub contributors page
- Release notes
- Our community (coming soon)

Top contributors may receive:

- Contributor badge
- Priority support
- Early access to features
- Swag (stickers, shirts)

## 📧 Communication

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas, general chat
- **Discord**: Real-time chat, help, community
- **Twitter**: Updates, announcements
- **Email**: Private matters (security, etc.)

## 🤝 Code of Conduct

We follow the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

### Our Standards

**Positive behavior**:

- Being respectful and inclusive
- Accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy

**Unacceptable behavior**:

- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

## ❓ Questions?

- Check our [documentation](https://github.com/miccy/snake-evolution#readme)
- Search [GitHub Discussions](https://github.com/miccy/snake-evolution/discussions)
- Email: <support@miccy.dev>

## 📚 Additional Resources

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## 🎉 Thank You

Your contributions make this project better for everyone. Whether it's code, documentation, bug reports, or just spreading the word - every contribution matters.

Happy coding! 🐍✨

---

**Have questions?** Open a [discussion](https://github.com/miccy/snake-evolution/discussions)!

---

## Čeština

### Jak můžete přispět?

Existuje mnoho způsobů, jak přispět:

- 🐛 **Hlásit chyby** - Pomozte nám zlepšit se
- 💡 **Navrhovat funkce** - Podělte se o své nápady
- 📝 **Vylepšit dokumentaci** - Učiňte ji jasnější
- 🎨 **Vytvářet šablony** - Navrhněte nové vizuální styly
- 🔧 **Odesílat kód** - Opravujte chyby nebo přidávejte funkce
- 🌍 **Překládat** - Pomozte nám expandovat globálně
- 💬 **Pomáhat ostatním** - Odpovídejte na otázky v diskuzích

### Začínáme

#### Předpoklady

- [Bun](https://bun.sh) >= 1.3.0 (primární) nebo [Node.js](https://nodejs.org) >= 22
- [Git](https://git-scm.com)
- [Docker](https://docker.com) (pro místní backend)
- GitHub účet

#### Nastavení vývojového prostředí

```bash
# 1. Forkněte repozitář
# Klikněte na "Fork" na GitHubu

# 2. Naklonujte svůj fork
git clone https://github.com/VAS_USERNAME/snake-evolution.git
cd snake-evolution

# 3. Přidejte upstream remote
git remote add upstream https://github.com/miccy/snake-evolution.git

# 4. Nainstalujte závislosti
bun install

# 5. Spusťte Docker služby (volitelné, pro backend)
docker compose -f docker/docker-compose.yml up -d

# 6. Vytvořte větev
git checkout -b feature/nazev-vasi-funkce

# 7. Spusťte vývoj
bun run dev
```

### Pracovní postup

1. **Vyberte issue** - Prohlédněte [otevřené issues](https://github.com/miccy/snake-evolution/issues)
2. **Vytvořte větev** - `git checkout -b feature/nova-funkce`
3. **Proveďte změny** - Dodržujte naše kódovací standardy
4. **Napište testy** - Každá změna by měla obsahovat testy
5. **Formátujte a lintujte** - `bun run quality`
6. **Commitujte** - Používejte [Conventional Commits](https://www.conventionalcommits.org/)
7. **Vytvořte PR** - Vyplňte šablonu PR

### Konvence commitů

```bash
git commit -m "feat(renderer): přidán neonový efekt záře"
git commit -m "fix(engine): opravena vlastní kolize hada"
git commit -m "docs(readme): přidány příklady použití CLI"
```

### Kodex chování

Řídíme se [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

### Otázky?

- Prohledejte [GitHub Diskuze](https://github.com/miccy/snake-evolution/discussions)
- Email: <support@miccy.dev>

### 🎉 Děkujeme

Vaše příspěvky činí tento projekt lepším pro všechny. Ať už jde o kód, dokumentaci, hlášení chyb nebo jen šíření slova - každý příspěvek má význam.

Šťastné kódování! 🐍✨

---

### 📖 Více detailů

Úplné pokyny (včetně vytváření šablon, detailní dokumentaci, hlášení chyb a procesu review) naleznete v [anglické sekci výše](#english).
