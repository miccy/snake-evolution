import { describe, expect, test } from "bun:test";
import type { ColorPalette, GlassTheme } from "./themes";
import { getGlassFilterDefs, getTheme, githubDark, glass, isGlassTheme } from "./themes";

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
    test("should return SVG string containing default glass theme values", () => {
      const defs = getGlassFilterDefs(glass);
      expect(defs).toContain("<defs>");
      expect(defs).toContain("</defs>");
      expect(defs).toContain('id="glass-blur"');
      expect(defs).toContain('id="glass-gradient"');
      expect(defs).toContain('id="glass-glow"');
      expect(defs).toContain(`stdDeviation="${glass.glass.blur}"`);
      expect(defs).toContain(`stop-color="${glass.glass.gradientStart}"`);
      expect(defs).toContain(`stop-color="${glass.glass.gradientEnd}"`);
      expect(defs).toContain(`0 0 0 ${glass.glass.opacity} 0`);
    });

    test("should render custom glass theme values dynamically", () => {
      const customGlass: GlassTheme = {
        ...githubDark,
        glass: {
          blur: 42,
          opacity: 0.85,
          borderOpacity: 0.3,
          gradientStart: "rgba(100, 200, 255, 0.5)",
          gradientEnd: "rgba(10, 20, 30, 0.1)",
        },
      };

      const defs = getGlassFilterDefs(customGlass);
      expect(defs).toContain('stdDeviation="42"');
      expect(defs).toContain("0 0 0 0.85 0");
      expect(defs).toContain('stop-color="rgba(100, 200, 255, 0.5)"');
      expect(defs).toContain('stop-color="rgba(10, 20, 30, 0.1)"');
    });
  });
});
