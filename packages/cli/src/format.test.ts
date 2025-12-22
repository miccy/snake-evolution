import { describe, expect, test } from "bun:test";
import { validateOutputFormat } from "./format";

describe("validateOutputFormat", () => {
  test("rejects gif format with helpful hint", () => {
    const result = validateOutputFormat("gif", "github-dark");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("GIF output is not supported");
      expect(result.hint).toContain("format svg");
    }
  });

  test("rejects glass theme until gif support is ready", () => {
    const result = validateOutputFormat("svg", "glass");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("glass theme");
      expect(result.hint).toContain("cypherpunk");
    }
  });

  test("rejects unknown formats", () => {
    const result = validateOutputFormat("png", "github-dark");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain('Unsupported format "png"');
      expect(result.hint).toContain("Use --format svg");
    }
  });

  test("accepts svg by default", () => {
    const result = validateOutputFormat(undefined, "github-dark");

    expect(result).toEqual({ ok: true, normalizedFormat: "svg" });
  });
});
