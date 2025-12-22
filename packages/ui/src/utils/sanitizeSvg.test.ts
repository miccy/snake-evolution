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
});
