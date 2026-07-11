/**
 * Formats a hex color value to a Tailwind class name.
 * Handles special keywords (transparent, inherit, currentColor) and opacity.
 *
 * @param hex - Hex color value (e.g., "#ff0000") or keyword
 * @param prefix - Tailwind prefix (e.g., "bg", "text")
 * @param opacity - Optional opacity percentage (0-100)
 * @returns Formatted Tailwind class (e.g., "bg-[#ff0000]", "bg-transparent", "bg-[#ff0000/50%]")
 */
export function createColorClass(hex: string, prefix: string, opacity?: number): string {
  if (hex === "transparent" || hex === "inherit" || hex === "currentColor") {
    return `${prefix}-${hex === "currentColor" ? "current" : hex}`;
  }

  if (opacity !== undefined && opacity < 100) {
    return `${prefix}-[${hex}/${opacity}%]`;
  }

  return `${prefix}-[${hex}]`;
}
