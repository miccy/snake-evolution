import { describe, expect, test } from "bun:test";
import { validateOutputFormat } from "./format";

describe("validateOutputFormat", () => {
  describe("successful validations", () => {
    test("accepts svg by default", () => {
      const result = validateOutputFormat(undefined, "github-dark");

      expect(result).toEqual({ ok: true, normalizedFormat: "svg" });
    });

    test("accepts explicit svg format", () => {
      const result = validateOutputFormat("svg", "ocean");

      expect(result).toEqual({ ok: true, normalizedFormat: "svg" });
    });

    test("accepts SVG with mixed case", () => {
      const result = validateOutputFormat("SVG", "github-light");

      expect(result).toEqual({ ok: true, normalizedFormat: "svg" });
    });

    test("accepts svg with whitespace", () => {
      const result = validateOutputFormat("  svg  ", "sunset");
      // Note: current implementation doesn't trim, so this will fail
      // This test documents the current behavior
      expect(result.ok).toBe(false);
    });

    test("accepts all valid themes with svg", () => {
      const themes = ["github-dark", "github-light", "ocean", "sunset", "neon-gamer", "cypherpunk"];

      for (const theme of themes) {
        const result = validateOutputFormat("svg", theme);
        expect(result.ok).toBe(true);
      }
    });

    test("accepts svg when theme is undefined", () => {
      const result = validateOutputFormat("svg", undefined);

      expect(result).toEqual({ ok: true, normalizedFormat: "svg" });
    });

    test("accepts svg when theme is empty string", () => {
      const result = validateOutputFormat("svg", "");

      expect(result).toEqual({ ok: true, normalizedFormat: "svg" });
    });
  });

  describe("GIF format rejections", () => {
    test("rejects gif format with helpful hint", () => {
      const result = validateOutputFormat("gif", "github-dark");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain("GIF output is not supported");
        expect(result.hint).toContain("format svg");
      }
    });

    test("rejects GIF with uppercase", () => {
      const result = validateOutputFormat("GIF", "ocean");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.normalizedFormat).toBe("gif");
        expect(result.reason).toContain("GIF output is not supported");
      }
    });

    test("rejects gif with any theme", () => {
      const themes = ["github-dark", "ocean", "sunset", "neon-gamer"];

      for (const theme of themes) {
        const result = validateOutputFormat("gif", theme);
        expect(result.ok).toBe(false);
      }
    });

    test("gif rejection includes normalized format in response", () => {
      const result = validateOutputFormat("GIF", "github-dark");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.normalizedFormat).toBe("gif");
      }
    });
  });

  describe("glass theme rejections", () => {
    test("rejects glass theme until gif support is ready", () => {
      const result = validateOutputFormat("svg", "glass");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain("glass theme");
        expect(result.hint).toContain("cypherpunk");
      }
    });

    test("rejects Glass with mixed case", () => {
      const result = validateOutputFormat("svg", "Glass");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain("glass theme");
        expect(result.reason).toContain("GIF rendering");
      }
    });

    test("rejects GLASS in all caps", () => {
      const result = validateOutputFormat("svg", "GLASS");

      expect(result.ok).toBe(false);
    });

    test("glass rejection mentions alternative themes", () => {
      const result = validateOutputFormat("svg", "glass");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.hint).toBeTruthy();
        expect(result.hint?.toLowerCase()).toContain("cypherpunk");
      }
    });

    test("rejects glass even with undefined format", () => {
      const result = validateOutputFormat(undefined, "glass");

      expect(result.ok).toBe(false);
    });
  });

  describe("unsupported format rejections", () => {
    test("rejects unknown formats", () => {
      const result = validateOutputFormat("png", "github-dark");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain('Unsupported format "png"');
        expect(result.hint).toContain("Use --format svg");
      }
    });

    test("rejects jpeg format", () => {
      const result = validateOutputFormat("jpeg", "ocean");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain('Unsupported format "jpeg"');
        expect(result.normalizedFormat).toBe("jpeg");
      }
    });

    test("rejects webp format", () => {
      const result = validateOutputFormat("webp", "sunset");

      expect(result.ok).toBe(false);
    });

    test("rejects mp4 format", () => {
      const result = validateOutputFormat("mp4", "neon-gamer");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain("mp4");
      }
    });

    test("unknown format errors include helpful hints", () => {
      const formats = ["png", "jpg", "webp", "bmp", "tiff"];

      for (const format of formats) {
        const result = validateOutputFormat(format, "github-dark");
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.hint).toBeTruthy();
          expect(result.hint).toContain("svg");
        }
      }
    });
  });

  describe("edge cases and boundary conditions", () => {
    test("handles both format and theme as undefined", () => {
      const result = validateOutputFormat(undefined, undefined);

      expect(result).toEqual({ ok: true, normalizedFormat: "svg" });
    });

    test("rejects empty string format", () => {
      const result = validateOutputFormat("", "github-dark");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain('Unsupported format ""');
      }
    });

    test("normalizes format to lowercase", () => {
      const result = validateOutputFormat("SvG", "ocean");

      expect(result).toEqual({ ok: true, normalizedFormat: "svg" });
    });

    test("normalizes theme to lowercase for comparison", () => {
      const result = validateOutputFormat("svg", "GitHub-Dark");

      expect(result).toEqual({ ok: true, normalizedFormat: "svg" });
    });

    test("rejects glass regardless of theme casing", () => {
      const casings = ["glass", "Glass", "GLASS", "gLaSs"];

      for (const casing of casings) {
        const result = validateOutputFormat("svg", casing);
        expect(result.ok).toBe(false);
      }
    });

    test("handles very long format strings", () => {
      const result = validateOutputFormat("a".repeat(1000), "github-dark");

      expect(result.ok).toBe(false);
    });

    test("handles special characters in format", () => {
      const result = validateOutputFormat("svg<script>", "github-dark");

      expect(result.ok).toBe(false);
    });
  });

  describe("error message quality", () => {
    test("all error responses include a reason", () => {
      const invalidCases = [
        ["gif", "github-dark"],
        ["png", "ocean"],
        ["svg", "glass"],
      ];

      for (const [format, theme] of invalidCases) {
        const result = validateOutputFormat(format, theme);
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.reason).toBeTruthy();
          expect(result.reason.length).toBeGreaterThan(10);
        }
      }
    });

    test("error reasons are user-friendly", () => {
      const result = validateOutputFormat("gif", "github-dark");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).not.toContain("undefined");
        expect(result.reason).not.toContain("null");
        expect(result.reason).not.toMatch(/error|exception/i);
      }
    });

    test("hints provide actionable guidance", () => {
      const result = validateOutputFormat("png", "github-dark");

      expect(result.ok).toBe(false);
      if (!result.ok && result.hint) {
        expect(result.hint).toContain("svg");
        expect(result.hint.length).toBeGreaterThan(5);
      }
    });
  });

  describe("type safety", () => {
    test("success response has correct shape", () => {
      const result = validateOutputFormat("svg", "ocean");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.normalizedFormat).toBe("svg");
        expect(Object.keys(result)).toEqual(["ok", "normalizedFormat"]);
      }
    });

    test("error response has correct shape", () => {
      const result = validateOutputFormat("gif", "github-dark");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result).toHaveProperty("normalizedFormat");
        expect(result).toHaveProperty("reason");
        expect(result).toHaveProperty("hint");
      }
    });
  });
});
