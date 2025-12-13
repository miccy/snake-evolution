---
title: Customization
description: Customize your snake animation appearance and behavior.
---

# Customization

Snake Evolution offers extensive customization options.

## Color Palettes

Choose from built-in palettes or create your own:

```yaml
# Built-in palettes
palette: github       # Default GitHub colors
palette: github-dark  # Dark theme
palette: ocean        # Blue ocean theme
palette: sunset       # Warm sunset colors
palette: neon         # Bright neon colors
```

See [Color Palettes](/guides/palettes) for all available options.

## Animation Settings

### Speed

Control the animation speed (frames per second):

```yaml
animation_speed: 10  # Faster
animation_speed: 5   # Default
animation_speed: 2   # Slower
```

### Frame Count

Set the number of animation frames:

```yaml
frame_count: 100  # Longer animation
frame_count: 50   # Default
frame_count: 20   # Shorter animation
```

## Snake Appearance

### Size

```yaml
cell_size: 10  # Smaller cells
cell_size: 15  # Default
cell_size: 20  # Larger cells
```

### Gap

```yaml
cell_gap: 2  # Default
cell_gap: 4  # More spacing
cell_gap: 0  # No gaps
```

## Custom Palettes

Create your own color palette:

```yaml
custom_palette: |
  {
    "name": "My Palette",
    "background": "#1a1a2e",
    "empty": "#16213e",
    "levels": ["#e94560", "#f27d85", "#f5a5ab", "#f8cdd0"],
    "snake": {
      "head": "#ffd700",
      "body": "#ffb700",
      "tail": "#ff9700"
    }
  }
```

## Output Format Options

### SVG Options

```yaml
outputs: dist/snake.svg?
  background=transparent&
  rounded=true
```

### GIF Options

```yaml
outputs: dist/snake.gif?
  animated=true&
  loop=true&
  quality=high
```

## Environment Variables

For advanced customization, use environment variables:

```yaml
env:
  SNAKE_YEAR: 2024
  SNAKE_MAX_LENGTH: 100
  SNAKE_PATHFINDING: astar
```
