import DOMPurify from "isomorphic-dompurify";

/**
 * DOMPurify configuration for SVG sanitization.
 * Uses the SVG profile with additional SMIL animation support.
 */
const DOMPURIFY_SVG_CONFIG = {
  USE_PROFILES: { svg: true, svgFilters: true },
  // Add SMIL animation elements that may not be in default profile
  ADD_TAGS: ["animate", "animateTransform", "animateMotion", "set"] as string[],
  ADD_ATTR: [
    // Animation attributes
    "attributeName",
    "begin",
    "dur",
    "end",
    "repeatCount",
    "values",
    "keyTimes",
    "keySplines",
    "calcMode",
    "from",
    "to",
    "by",
  ] as string[],
  RETURN_DOM: false as const,
  RETURN_DOM_FRAGMENT: false as const,
};

/**
 * Sanitizes SVG markup by removing scripts and dangerous attributes.
 * Uses isomorphic-dompurify for robust sanitization in both browser and server environments.
 */
export function sanitizeSvgContent(svgContent: string): string {
  if (!svgContent) {
    return "";
  }

  // Basic structure check - must contain SVG tags (O(1) check to avoid ReDoS)
  const hasOpenTag = svgContent.includes("<svg");
  const hasCloseTag = svgContent.includes("</svg>");
  if (!hasOpenTag || !hasCloseTag) {
    return "";
  }

  try {
    const sanitized = DOMPurify.sanitize(svgContent, DOMPURIFY_SVG_CONFIG);

    // DOMPurify returns empty string for completely invalid content
    if (!sanitized) {
      return "";
    }

    return sanitized as string;
  } catch {
    // If sanitization fails for any reason, return empty string for safety
    return "";
  }
}
