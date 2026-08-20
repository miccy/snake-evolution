import { describe, expect, test } from "bun:test";
import type { ColorPalette, GlassTheme } from "./themes";
import {
  cypherpunk,
  getGlassFilterDefs,
  getTheme,
  githubDark,
  githubLight,
  glass,
  isGlassTheme,
  neonGamer,
  ocean,
  sunset,
  themes,
} from "./themes";

describe("Themes", () => {
  describe("isGlassTheme", () => {
    test("should return true for the official glass theme", () => {
      expect(isGlassTheme(glass)).toBe(true);
    });

    test("should return true for a custom glass theme object", () => {
      const customGlass: GlassTheme = {
        ...githubDark,
        glass: {
          blur: 10,
          opacity: 0.5,
          borderOpacity: 0.1,
          gradientStart: "white",
          gradientEnd: "black",
        },
      };
      expect(isGlassTheme(customGlass)).toBe(true);
    });

    test("should return false for all built-in non-glass themes", () => {
      expect(isGlassTheme(githubLight)).toBe(false);
      expect(isGlassTheme(githubDark)).toBe(false);
      expect(isGlassTheme(ocean)).toBe(false);
      expect(isGlassTheme(sunset)).toBe(false);
      expect(isGlassTheme(neonGamer)).toBe(false);
      expect(isGlassTheme(cypherpunk)).toBe(false);
    });

    test("should return true only for glass theme in themes registry", () => {
      for (const [key, theme] of Object.entries(themes)) {
        if (key === "glass") {
          expect(isGlassTheme(theme)).toBe(true);
        } else {
          expect(isGlassTheme(theme)).toBe(false);
        }
      }
    });

    test("should return false for a regular palette without glass property", () => {
      const regular: ColorPalette = { ...githubDark };
      expect(isGlassTheme(regular)).toBe(false);
    });
  });

  describe("getTheme", () => {
    test("should return the requested theme", () => {
      expect(getTheme("glass")).toBe(glass);
      expect(getTheme("github-dark")).toBe(githubDark);
    });

    test("should return github-dark as fallback for unknown themes", () => {
      expect(getTheme("non-existent")).toBe(githubDark);
    });
  });

  describe("getGlassFilterDefs", () => {
    test("should return SVG string containing theme values", () => {
      const defs = getGlassFilterDefs(glass);
      expect(defs).toContain('id="glass-blur"');
      expect(defs).toContain('id="glass-gradient"');
      expect(defs).toContain('id="glass-glow"');
      expect(defs).toContain(`stdDeviation="${glass.glass.blur}"`);
      expect(defs).toContain(`stop-color="${glass.glass.gradientStart}"`);
      expect(defs).toContain(`stop-color="${glass.glass.gradientEnd}"`);
    });
  });
});
