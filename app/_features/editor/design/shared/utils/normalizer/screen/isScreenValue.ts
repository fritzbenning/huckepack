import { SCREEN_KEYWORDS } from "./constants";

/**
 * Checks if a value and unit match the screen keyword for a given dimension.
 *
 * @param value - The numeric value
 * @param unit - The unit string
 * @param dimension - The dimension ("width" or "height")
 * @returns True if the value and unit match the screen keyword
 * @example
 * // Check if value matches screen keyword
 * isScreenValue(100, "vw", "width")
 * // Returns: true (if screen width is 100vw)
 */
export function isScreenValue(value: number, unit: string, dimension: "width" | "height"): boolean {
  const screen = SCREEN_KEYWORDS[dimension];
  return value === screen.value && unit === screen.unit;
}
