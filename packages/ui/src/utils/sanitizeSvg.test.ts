import { describe, expect, test } from "bun:test";
import { sanitizeSvgContent } from "./sanitizeSvg";

describe("sanitizeSvgContent", () => {
  describe("script tag removal", () => {
    test("removes script tags from SVG markup", () => {
      const dirtySvg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><script>alert("xss")</script><rect width="10" height="10" fill="blue" /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("<script");
      expect(sanitized).toContain("<rect");
    });

    test("removes script tags with attributes", () => {
      const dirtySvg =
        '<svg><script type="text/javascript" src="evil.js">alert(1)</script><circle r="5" /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("<script");
      expect(sanitized).not.toContain("evil.js");
      expect(sanitized).toContain("<circle");
    });

    test("removes multiple script tags", () => {
      const dirtySvg =
        '<svg><script>alert(1)</script><rect /><script>alert(2)</script><circle /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("<script");
      expect(sanitized).not.toContain("alert");
      expect(sanitized).toContain("<rect");
      expect(sanitized).toContain("<circle");
    });

    test("removes nested script tags", () => {
      const dirtySvg =
        '<svg><g><script>alert(1)</script></g><rect /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("<script");
      expect(sanitized).toContain("<g");
      expect(sanitized).toContain("<rect");
    });

    test("removes script tags with various spacing", () => {
      const dirtySvg =
        '<svg><script   type="text/javascript"  >alert(1)</script  ><rect /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("<script");
    });

    test("removes script tags with newlines", () => {
      const dirtySvg = `<svg>
        <script>
          alert('xss');
        </script>
        <rect />
      </svg>`;

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("<script");
      expect(sanitized).not.toContain("alert");
    });

    test("removes script with CDATA", () => {
      const dirtySvg =
        '<svg><script><![CDATA[alert(1)]]></script><rect /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("<script");
      expect(sanitized).not.toContain("CDATA");
    });
  });

  describe("event handler removal", () => {
    test("removes onclick handlers", () => {
      const dirtySvg =
        '<svg><rect onclick="alert(1)" width="10" height="10" fill="red" /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("onclick");
      expect(sanitized).toContain("<rect");
      expect(sanitized).toContain('fill="red"');
    });

    test("removes onload handlers", () => {
      const dirtySvg =
        '<svg onload="alert(1)"><rect /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("onload");
      expect(sanitized).toContain("<svg");
    });

    test("removes onmouseover handlers", () => {
      const dirtySvg =
        '<svg><circle onmouseover="alert(1)" r="5" /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("onmouseover");
    });

    test("removes onerror handlers", () => {
      const dirtySvg =
        '<svg><image onerror="alert(1)" href="broken.jpg" /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("onerror");
    });

    test("removes multiple event handlers from same element", () => {
      const dirtySvg =
        '<svg><rect onclick="alert(1)" onmouseover="alert(2)" onmouseout="alert(3)" /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("onclick");
      expect(sanitized).not.toContain("onmouseover");
      expect(sanitized).not.toContain("onmouseout");
    });

    test("removes event handlers with mixed case", () => {
      const dirtySvg =
        '<svg><rect onClick="alert(1)" onLoad="alert(2)" /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized.toLowerCase()).not.toContain("onclick");
      expect(sanitized.toLowerCase()).not.toContain("onload");
    });
  });

  describe("href sanitization", () => {
    test("removes javascript: protocol from href", () => {
      const dirtySvg =
        '<svg><a href="javascript:alert(1)"><text>Click</text></a></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("javascript:");
      expect(sanitized).toContain("<a");
      expect(sanitized).toContain("<text");
    });

    test("removes javascript: protocol from xlink:href", () => {
      const dirtySvg =
        '<svg><use xlink:href="javascript:alert(1)" /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("javascript:");
    });

    test("allows safe http URLs in href", () => {
      const safeSvg =
        '<svg><a href="https://example.com"><text>Link</text></a></svg>';

      const sanitized = sanitizeSvgContent(safeSvg);

      expect(sanitized).toContain("https://example.com");
    });

    test("allows safe relative URLs in href", () => {
      const safeSvg =
        '<svg><a href="#section"><text>Link</text></a></svg>';

      const sanitized = sanitizeSvgContent(safeSvg);

      expect(sanitized).toContain("#section");
    });

    test("removes javascript: with mixed case", () => {
      const dirtySvg =
        '<svg><a href="JaVaScRiPt:alert(1)"><text>Click</text></a></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized.toLowerCase()).not.toContain("javascript:");
    });

    test("removes javascript: with whitespace", () => {
      const dirtySvg =
        '<svg><a href="  javascript:alert(1)"><text>Click</text></a></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("javascript:");
    });
  });

  describe("edge cases", () => {
    test("handles empty string", () => {
      const sanitized = sanitizeSvgContent("");

      expect(sanitized).toBe("");
    });

    test("handles null-like values", () => {
      // @ts-expect-error Testing runtime behavior
      const sanitized = sanitizeSvgContent(null);

      expect(sanitized).toBe("");
    });

    test("handles plain text without XML", () => {
      const sanitized = sanitizeSvgContent("just plain text");

      expect(sanitized).toBe("");
    });

    test("handles malformed XML", () => {
      const malformed = '<svg><rect><unclosed>';

      const sanitized = sanitizeSvgContent(malformed);

      // Should return empty string for parse errors
      expect(sanitized).toBe("");
    });

    test("preserves valid SVG structure", () => {
      const validSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect x="10" y="10" width="50" height="50" fill="blue" /><circle cx="75" cy="75" r="20" fill="red" /></svg>';

      const sanitized = sanitizeSvgContent(validSvg);

      expect(sanitized).toContain("<svg");
      expect(sanitized).toContain("<rect");
      expect(sanitized).toContain("<circle");
      expect(sanitized).toContain('fill="blue"');
      expect(sanitized).toContain('fill="red"');
    });

    test("handles SVG with animations", () => {
      const animatedSvg =
        '<svg><rect width="10" height="10"><animate attributeName="x" from="0" to="100" dur="1s" /></rect></svg>';

      const sanitized = sanitizeSvgContent(animatedSvg);

      expect(sanitized).toContain("<animate");
      expect(sanitized).toContain("attributeName");
    });

    test("handles SVG with filters", () => {
      const filterSvg =
        '<svg><defs><filter id="blur"><feGaussianBlur stdDeviation="5" /></filter></defs><rect filter="url(#blur)" /></svg>';

      const sanitized = sanitizeSvgContent(filterSvg);

      expect(sanitized).toContain("<filter");
      expect(sanitized).toContain("<feGaussianBlur");
    });

    test("handles very large SVG", () => {
      const largeRects = Array.from({ length: 1000 }, (_, i) =>
        `<rect x="${i}" y="${i}" width="10" height="10" />`
      ).join("");
      const largeSvg = `<svg>${largeRects}</svg>`;

      const sanitized = sanitizeSvgContent(largeSvg);

      expect(sanitized).toContain("<svg");
      expect(sanitized).toContain("<rect");
    });
  });

  describe("combined attack vectors", () => {
    test("removes script and event handlers together", () => {
      const dirtySvg =
        '<svg onclick="alert(1)"><script>alert(2)</script><rect onload="alert(3)" /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      expect(sanitized).not.toContain("<script");
      expect(sanitized).not.toContain("onclick");
      expect(sanitized).not.toContain("onload");
      expect(sanitized).not.toContain("alert");
    });

    test("handles script in comment", () => {
      const dirtySvg =
        '<svg><!-- <script>alert(1)</script> --><rect /></svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      // Comments should be preserved but scripts should still be removed
      expect(sanitized).toContain("<rect");
    });

    test("handles encoded script tags", () => {
      const dirtySvg =
        '<svg><rect />&lt;script&gt;alert(1)&lt;/script&gt;</svg>';

      const sanitized = sanitizeSvgContent(dirtySvg);

      // Encoded tags should remain encoded and harmless
      expect(sanitized).toContain("<rect");
    });
  });

  describe("DOMParser fallback", () => {
    test("preserves valid SVG attributes", () => {
      const svg =
        '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" fill="blue" stroke="black" stroke-width="2" /></svg>';

      const sanitized = sanitizeSvgContent(svg);

      expect(sanitized).toContain("viewBox");
      expect(sanitized).toContain('fill="blue"');
      expect(sanitized).toContain('stroke="black"');
    });

    test("handles SVG with gradients", () => {
      const svg =
        '<svg><defs><linearGradient id="grad"><stop offset="0%" stop-color="red" /><stop offset="100%" stop-color="blue" /></linearGradient></defs><rect fill="url(#grad)" /></svg>';

      const sanitized = sanitizeSvgContent(svg);

      expect(sanitized).toContain("linearGradient");
      expect(sanitized).toContain("stop-color");
    });
  });

  describe("real-world snake SVG scenarios", () => {
    test("handles contribution grid SVG", () => {
      const gridSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="742" height="98"><rect width="742" height="98" fill="#0d1117" rx="6" /><rect x="3" y="3" width="11" height="11" fill="#161b22" rx="2" /><rect x="17" y="3" width="11" height="11" fill="#0e4429" rx="2" /></svg>';

      const sanitized = sanitizeSvgContent(gridSvg);

      expect(sanitized).toContain("<svg");
      expect(sanitized).toContain('fill="#0d1117"');
      expect(sanitized).toContain('rx="2"');
    });

    test("handles animated snake SVG with SMIL", () => {
      const snakeSvg =
        '<svg xmlns="http://www.w3.org/2000/svg"><rect width="11" height="11"><animate attributeName="opacity" values="1;0" dur="0.5s" fill="freeze" /></rect></svg>';

      const sanitized = sanitizeSvgContent(snakeSvg);

      expect(sanitized).toContain("<animate");
      expect(sanitized).toContain("attributeName");
      expect(sanitized).toContain("opacity");
    });
  });
});