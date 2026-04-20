import { describe, expect, test } from "bun:test";
import {
  getGlassFilterDefs,
  getTheme,
  githubDark,
  glass,
  isGlassTheme,
} from "./themes";
import type { ColorPalette, GlassTheme } from "./themes";

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

    test("should return false for github-dark theme", () => {
      expect(isGlassTheme(githubDark)).toBe(false);
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
