export interface SnakePreviewProps {
  svgContent: string;
  className?: string;
}

export function SnakePreview({ svgContent, className = "" }: SnakePreviewProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG content is sanitized
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
