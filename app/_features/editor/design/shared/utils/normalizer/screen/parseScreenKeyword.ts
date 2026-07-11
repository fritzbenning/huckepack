import { SCREEN_KEYWORDS } from "./constants";

/**
 * Parses a screen keyword class name to extract value and unit.
 *
 * @param className - The class name (e.g., "w-screen", "min-h-screen")
 * @param dimension - The dimension ("width" or "height")
 * @returns Object with value and unit, or null if not a screen keyword
 * @example
 * // Parse screen keyword
 * parseScreenKeyword("w-screen", "width")
 * // Returns: { value: 100, unit: "vw" }
 *
 * @example
 * parseScreenKeyword("min-h-screen", "height")
 * // Returns: { value: 100, unit: "vh" }
 */
export function parseScreenKeyword(
  className: string,
  dimension: "width" | "height"
): { value: number; unit: string } | null {
  const basePrefix = dimension === "width" ? "w" : "h";
  const prefixes = [`${basePrefix}-screen`, `min-${basePrefix}-screen`, `max-${basePrefix}-screen`];

  if (prefixes.includes(className)) {
    const screen = SCREEN_KEYWORDS[dimension];
    return { value: screen.value, unit: screen.unit };
  }
  return null;
}
