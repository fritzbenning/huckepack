import type { TokenMap } from "@editor/design/values/token/types";

/**
 * Converts a token name to a Tailwind scale value class.
 * Converts px to scale (px / 4) then formats as class.
 *
 * @param token - The token name (e.g., "sm", "md")
 * @param tokenMap - Token map mapping tokens to px values
 * @param prefix - The property prefix (e.g., "w")
 * @returns Formatted Tailwind scale class, or empty string if token not found
 * @example
 * // Convert token to scale value
 * convertTokenToScaleValue("sm", tokenMap, "w")
 * // Returns: "w-2" (if sm = 8px = scale 2)
 *
 * @example
 * convertTokenToScaleValue("md", tokenMap, "w")
 * // Returns: "w-4" (if md = 16px = scale 4)
 */
export function convertTokenToScaleValue(token: string, tokenMap: TokenMap, prefix: string): string | null {
  console.log("convertTokenToScaleValue", token, tokenMap, prefix);

  const pxValue = tokenMap[token];

  console.log("pxValue", pxValue);

  if (!pxValue) {
    console.warn("Token not found in token map", token, tokenMap);
    return null;
  }

  if (pxValue === Infinity || !Number.isFinite(pxValue)) {
    return null;
  }

  const scaleValue = pxValue / 4;

  return `${prefix}-${scaleValue}`;
}
