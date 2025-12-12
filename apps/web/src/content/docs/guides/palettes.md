---
title: Color Palettes
description: Available color palettes for your snake animation.
---

# Color Palettes

Snake Evolution includes several built-in color palettes.

## GitHub (Default)

The classic GitHub contribution colors.

```yaml
palette: github
```

| Element | Color |
|---------|-------|
| Background | `#0d1117` |
| Empty | `#161b22` |
| Level 1 | `#0e4429` |
| Level 2 | `#006d32` |
| Level 3 | `#26a641` |
| Level 4 | `#39d353` |
| Snake Head | `#58a6ff` |
| Snake Body | `#388bfd` |

## GitHub Dark

Optimized for dark mode displays.

```yaml
palette: github-dark
```

## Ocean

A calming blue ocean theme.

```yaml
palette: ocean
```

| Element | Color |
|---------|-------|
| Background | `#0a192f` |
| Empty | `#112240` |
| Levels | Blue gradients |
| Snake | Cyan/teal |

## Sunset

Warm sunset colors.

```yaml
palette: sunset
```

| Element | Color |
|---------|-------|
| Background | `#1a1a2e` |
| Empty | `#16213e` |
| Levels | Pink/coral gradients |
| Snake | Gold/orange |

## Neon

Bright, vibrant neon colors.

```yaml
palette: neon
```

## Dracula

Based on the popular Dracula theme.

```yaml
palette: dracula
```

## Nord

Cool, arctic-inspired colors.

```yaml
palette: nord
```

## Creating Custom Palettes

Define your own palette using JSON:

```json
{
  "name": "Custom",
  "background": "#1a1a2e",
  "empty": "#16213e",
  "levels": ["#color1", "#color2", "#color3", "#color4"],
  "snake": {
    "head": "#headColor",
    "body": "#bodyColor",
    "tail": "#tailColor"
  }
}
```

### Tips for Custom Palettes

1. **Contrast** - Ensure good contrast between levels
2. **Accessibility** - Test with color blindness simulators
3. **Consistency** - Keep the snake visible against all backgrounds
4. **Gradients** - Use smooth color transitions for levels
