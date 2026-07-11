/**
 * Formats a screen keyword class name for a given dimension.
 *
 * @param dimension - The dimension ("width" or "height")
 * @returns The formatted screen keyword class name
 * @example
 * // Format screen keyword for width
 * formatScreenKeyword("width")
 * // Returns: "w-screen"
 *
 * @example
 * formatScreenKeyword("height")
 * // Returns: "h-screen"
 */
export function formatScreenKeyword(dimension: "width" | "height"): string {
  const prefix = dimension === "width" ? "w" : "h";
  return `${prefix}-screen`;
}

