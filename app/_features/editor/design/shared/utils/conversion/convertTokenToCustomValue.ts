import { convertNumericValueToUnit } from "@editor/design/values/numeric/value/convertNumericValueToUnit";
import type { TokenMap } from "@editor/design/values/token/types";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";

/**
 * Converts a token name to a custom value Tailwind class.
 *
 * @param token - The token name (e.g., "sm", "md")
 * @param tokenMap - Token map mapping tokens to px values
 * @param property - The property prefix (e.g., "w")
 * @param unit - Target unit ("px" or "rem")
 * @returns Formatted Tailwind class with arbitrary value, or empty string if token not found
 * @example
 * // Convert token to px custom value
 * convertTokenToCustomValue("sm", tokenMap, "w", "px")
 * // Returns: "w-[8px]" (if sm = 8px)
 *
 * @example
 * // Convert token to rem custom value
 * convertTokenToCustomValue("sm", tokenMap, "w", "rem")
 * // Returns: "w-[0.5rem]" (if sm = 8px = 0.5rem)
 */
export function convertTokenToCustomValue(
  token: string,
  tokenMap: TokenMap,
  property: string,
  unit: Unit = "px"
): string | null {
  const pxValue = tokenMap[token];

  if (!pxValue) {
    return null;
  }

  if (pxValue === Infinity) {
    return `${property}-[9999px]`;
  }

  if (!Number.isFinite(pxValue)) {
    return null;
  }

  if (unit && unit !== "px") {
    const convertedValue = convertNumericValueToUnit(pxValue, "px", unit);
    if (convertedValue !== null) {
      return `${property}-[${convertedValue}${unit}]`;
    }
  }

  return `${property}-[${pxValue}px]`;
}
