# @snake-evolution/ui

Shared React UI components for the Snake Evolution web applications.

## Installation

```bash
bun add @snake-evolution/ui
```

## Components

### Button

Styled button component with variants.

```tsx
import { Button } from '@snake-evolution/ui';

<Button variant="primary" onClick={handleClick}>
  Generate Snake
</Button>
```

### Card

Container component with consistent styling.

```tsx
import { Card } from '@snake-evolution/ui';

<Card title="My Snake Animation">
  <img src={snakeSvg} alt="Snake" />
</Card>
```

### SnakePreview

Live preview component for snake animations.

```tsx
import { SnakePreview } from '@snake-evolution/ui';

<SnakePreview
  username="octocat"
  theme="github"
  animated
/>
```

## Exports

```typescript
// Components
export { Button } from './components/Button';
export { Card } from './components/Card';
export { SnakePreview } from './components/SnakePreview';

// Types
export type { ButtonProps } from './components/Button';
export type { CardProps } from './components/Card';
export type { SnakePreviewProps } from './components/SnakePreview';
```

## Related Packages

- [`apps/web`](../../apps/web) – Web application using these components
- [`@snake-evolution/types`](../types) – Shared TypeScript types
