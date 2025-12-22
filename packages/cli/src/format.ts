/**
 * Validates output format requests so we can give users clear guidance instead of silent fallbacks.
 */
export function validateOutputFormat(
  rawFormat: string | undefined,
  theme: string | undefined,
):
  | { ok: true; normalizedFormat: "svg" }
  | { ok: false; normalizedFormat: string; reason: string; hint?: string } {
  const normalizedFormat = (rawFormat || "svg").toLowerCase();
  const normalizedTheme = (theme ?? "").toLowerCase();

  if (normalizedFormat === "gif") {
    return {
      ok: false,
      normalizedFormat,
      reason: "GIF output is not supported yet.",
      hint: "Use --format svg for now.",
    };
  }

  if (normalizedTheme === "glass") {
    return {
      ok: false,
      normalizedFormat,
      reason: "The glass theme depends on GIF rendering, which is currently unavailable.",
      hint: "Choose another theme such as cypherpunk until GIF support ships.",
    };
  }

  if (normalizedFormat !== "svg") {
    return {
      ok: false,
      normalizedFormat,
      reason: `Unsupported format "${normalizedFormat}". Only svg is available right now.`,
      hint: "Use --format svg while we build out additional outputs.",
    };
  }

  return { ok: true, normalizedFormat: "svg" };
}
