// Snake Evolution - Theme System
// GitHub Light/Dark themes with exact colors + experimental glass theme

import type { ColorPalette } from '@snake-evolution/types'

// ============================================
// GitHub Official Colors (extracted from github.com CSS)
// ============================================

export const githubLight: ColorPalette = {
  name: 'GitHub Light',
  background: '#ffffff',
  empty: '#ebedf0',
  levels: ['#9be9a8', '#40c463', '#30a14e', '#216e39'],
  snake: {
    head: '#24292f',
    body: '#57606a',
    tail: '#8c959f',
  },
}

export const githubDark: ColorPalette = {
  name: 'GitHub Dark',
  background: '#0d1117',
  empty: '#161b22',
  levels: ['#0e4429', '#006d32', '#26a641', '#39d353'],
  snake: {
    head: '#58a6ff',
    body: '#388bfd',
    tail: '#1f6feb',
  },
}

// ============================================
// Premium Themes
// ============================================

export const ocean: ColorPalette = {
  name: 'Ocean Deep',
  background: '#0a192f',
  empty: '#112240',
  levels: ['#1e3a5f', '#2d5986', '#3c78ad', '#4b97d4'],
  snake: {
    head: '#64ffda',
    body: '#4cd9c4',
    tail: '#34b3ae',
  },
}

export const sunset: ColorPalette = {
  name: 'Sunset Vibes',
  background: '#1a1a2e',
  empty: '#16213e',
  levels: ['#e94560', '#f27d85', '#f5a5ab', '#f8cdd0'],
  snake: {
    head: '#ffd700',
    body: '#ffb700',
    tail: '#ff9700',
  },
}

export const neonGamer: ColorPalette = {
  name: 'Neon Gamer',
  background: '#0f0f23',
  empty: '#1a1a35',
  levels: ['#6c3f99', '#8b5fc7', '#aa7ff0', '#c9a0ff'],
  snake: {
    head: '#00ff88',
    body: '#00cc6a',
    tail: '#00994d',
  },
}

// ============================================
// Glass Theme (iOS 26 Liquid Glass)
// ============================================

export interface GlassTheme extends ColorPalette {
  glass: {
    blur: number
    opacity: number
    borderOpacity: number
    gradientStart: string
    gradientEnd: string
  }
}

export const glass: GlassTheme = {
  name: 'Liquid Glass',
  background: 'transparent',
  empty: 'rgba(255, 255, 255, 0.08)',
  levels: [
    'rgba(155, 233, 168, 0.4)',
    'rgba(64, 196, 99, 0.5)',
    'rgba(48, 161, 78, 0.6)',
    'rgba(33, 110, 57, 0.7)',
  ],
  snake: {
    head: 'rgba(255, 255, 255, 0.9)',
    body: 'rgba(255, 255, 255, 0.6)',
    tail: 'rgba(255, 255, 255, 0.3)',
  },
  glass: {
    blur: 20,
    opacity: 0.15,
    borderOpacity: 0.2,
    gradientStart: 'rgba(255, 255, 255, 0.25)',
    gradientEnd: 'rgba(255, 255, 255, 0.05)',
  },
}

// ============================================
// Theme Registry
// ============================================

export const themes: Record<string, ColorPalette | GlassTheme> = {
  'github-light': githubLight,
  'github-dark': githubDark,
  ocean,
  sunset,
  'neon-gamer': neonGamer,
  glass,
}

export function getTheme(name: string): ColorPalette {
  const theme = themes[name]
  if (!theme) {
    console.warn(`Theme "${name}" not found, falling back to github-dark`)
    return githubDark
  }
  return theme
}

export function isGlassTheme(theme: ColorPalette): theme is GlassTheme {
  return 'glass' in theme
}

// ============================================
// SVG Filters for Glass Effect
// ============================================

export function getGlassFilterDefs(theme: GlassTheme): string {
  return `
    <defs>
      <filter id="glass-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${theme.glass.blur}" result="blur" />
        <feColorMatrix in="blur" type="matrix" 
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 ${theme.glass.opacity} 0" />
      </filter>
      <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${theme.glass.gradientStart}" />
        <stop offset="100%" stop-color="${theme.glass.gradientEnd}" />
      </linearGradient>
      <filter id="glass-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  `
}

export type { ColorPalette }
