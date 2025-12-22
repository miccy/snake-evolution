const UNSAFE_PROTOCOL = /^javascript:/i;

const isDomParserAvailable = typeof DOMParser !== "undefined";

/**
 * Sanitizes SVG markup by removing scripts and dangerous attributes.
 */
export function sanitizeSvgContent(svgContent: string): string {
  if (!svgContent) {
    return "";
  }

  if (!isDomParserAvailable) {
    return stripScriptTags(svgContent);
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(svgContent, "image/svg+xml");
  const root = parsed.documentElement;

  if (
    root.nodeName === "parsererror" ||
    parsed.querySelector("parsererror") ||
    root.nodeName.toLowerCase() !== "svg"
  ) {
    return "";
  }

  parsed.querySelectorAll("script").forEach((node) => {
    node.remove();
  });

  const walker = parsed.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let current: Element | null = root;

  while (current) {
    Array.from(current.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();

      if (name.startsWith("on")) {
        current?.removeAttribute(attribute.name);
      }

      if (isUnsafeHref(name, value)) {
        current?.removeAttribute(attribute.name);
      }
    });

    current = walker.nextNode() as Element | null;
  }

  return root.outerHTML;
}

const isUnsafeHref = (name: string, value: string) =>
  (name === "href" || name === "xlink:href") && UNSAFE_PROTOCOL.test(value);

const stripScriptTags = (content: string) => {
  // Mitigate ReDoS by limiting input length
  if (content.length > 100000) {
    return "";
  }

  // Basic structure check - must look like SVG
  if (!/<svg[\s\S]*<\/svg>/i.test(content)) {
    return "";
  }

  let previous: string;
  let current = content;

  do {
    previous = current;
    // Remove script tags
    current = current.replace(/<script\b[\s\S]*?<\/script[^>]*>/gi, "");

    // Remove event handlers (onclick, onload, etc.)
    current = current.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

    // Remove javascript: URLs in href and xlink:href
    current = current.replace(
      /\s+(?:xlink:)?href\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*'|[^\s>]*javascript:[^\s>]*)/gi,
      "",
    );
  } while (current !== previous);

  return current;
};
