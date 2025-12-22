import { describe, expect, test } from "bun:test";
import { sanitizeSvgContent } from "./sanitizeSvg";

describe("sanitizeSvgContent", () => {
  test("removes script tags from SVG markup", () => {
    const dirtySvg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><script>alert("xss")</script><rect width="10" height="10" fill="blue" /></svg>';

    const sanitized = sanitizeSvgContent(dirtySvg);

    expect(sanitized).not.toContain("<script");
    expect(sanitized).toContain("<rect");
  });

  test("removes event handler attributes", () => {
    const dirtySvg =
      '<svg xmlns="http://www.w3.org/2000/svg"><rect onclick="alert(1)" width="10" height="10" /></svg>';

    const sanitized = sanitizeSvgContent(dirtySvg);

    expect(sanitized).not.toContain("onclick");
    expect(sanitized).toContain("<rect");
  });

  test("removes unsafe href values", () => {
    const dirtySvg =
      '<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)">link</a></svg>';

    const sanitized = sanitizeSvgContent(dirtySvg);

    expect(sanitized).not.toContain("javascript:");
  });

  test("handles empty input", () => {
    const sanitized = sanitizeSvgContent("");

    expect(sanitized).toBe("");
  });

  test("handles malformed SVG", () => {
    const malformed = "<svg><unclosed>";

    const sanitized = sanitizeSvgContent(malformed);

    expect(sanitized).toBeDefined();
  });
});
