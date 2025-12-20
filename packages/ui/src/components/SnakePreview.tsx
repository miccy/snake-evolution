import { useMemo } from "react";
import { sanitizeSvgContent } from "../utils/sanitizeSvg";

export interface SnakePreviewProps {
  svgContent: string;
  className?: string;
  /**
   * Render raw SVG without sanitization. For trusted, internal-only content.
   */
  unsafe?: boolean;
}

/**
 * Displays provided SVG markup after sanitization to avoid XSS in previews.
 */
export function SnakePreview({
  svgContent,
  className = "",
  unsafe = false,
}: SnakePreviewProps) {
  const safeSvg = useMemo(
    () => (unsafe ? svgContent : sanitizeSvgContent(svgContent)),
    [svgContent, unsafe],
  );

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG content is sanitized
      dangerouslySetInnerHTML={{ __html: safeSvg }}
    />
  );
}
