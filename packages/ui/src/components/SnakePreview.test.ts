import { describe, expect, test } from "bun:test";
import { sanitizeSvgContent } from "../utils/sanitizeSvg";

describe("SnakePreview SVG Sanitization Integration", () => {
  test("sanitizes dangerous script tags from SVG content used in SnakePreview", () => {
    const dirtySvg =
      '<svg><script>alert("xss")</script><rect width="10" height="10" fill="blue" /></svg>';
    const safeSvg = sanitizeSvgContent(dirtySvg);

    expect(safeSvg).not.toContain("<script");
    expect(safeSvg).not.toContain("alert");
    expect(safeSvg).toContain("<rect");
    expect(safeSvg).toContain('fill="blue"');
  });

  test("sanitizes event handlers from SVG content used in SnakePreview", () => {
    const dirtySvg = '<svg><rect onclick="alert(1)" width="10" height="10" fill="green" /></svg>';
    const safeSvg = sanitizeSvgContent(dirtySvg);

    expect(safeSvg).not.toContain("onclick");
    expect(safeSvg).toContain("<rect");
    expect(safeSvg).toContain('fill="green"');
  });
});
