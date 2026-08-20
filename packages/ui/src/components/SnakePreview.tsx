import { useMemo } from "react";
import { sanitizeSvgContent } from "../utils/sanitizeSvg";

export interface SnakePreviewProps {
  svgContent: string;
  className?: string;
}

/**
 * Displays provided SVG markup after sanitization to avoid XSS in previews.
 */
export function SnakePreview({ svgContent, className = "" }: SnakePreviewProps) {
  const safeSvg = useMemo(() => sanitizeSvgContent(svgContent), [svgContent]);

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG content is sanitized
      dangerouslySetInnerHTML={{ __html: safeSvg }}
    />
  );
}
