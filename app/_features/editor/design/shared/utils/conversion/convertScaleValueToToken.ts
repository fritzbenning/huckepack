import type { TokenMap } from "@editor/design/values/token/types";
import { normalizePrefix } from "../normalize/normalizePrefix";
import { findNearestToken } from "./findNearestToken";

/**
 * Converts a Tailwind scale value class to a token name.
 * Converts scale to px (scale * 4) then finds matching token.
 *
 * @param scaleClass - The Tailwind scale class (e.g., "w-4")
 * @param tokenMap - Token map mapping tokens to px values
 * @param property - The property prefix (e.g., "w")
 * @returns The token name, or undefined if conversion fails
 * @example
 * // Convert scale value to token
 * convertScaleValueToToken("w-4", tokenMap, "w")
 * // Returns: "sm" (if scale 4 = 16px = sm token)
 *
 * @example
 * convertScaleValueToToken("w-8", tokenMap, "w")
 * // Returns: "md" (if scale 8 = 32px = md token)
 */
export function convertScaleValueToToken(scaleClass: string, tokenMap: TokenMap, property: string): string | undefined {
  if (!scaleClass) return undefined;

  const normalizedPrefix = normalizePrefix(property);

  if (!scaleClass.startsWith(normalizedPrefix)) {
    return undefined;
  }

  const suffix = scaleClass.substring(normalizedPrefix.length);

  if (!suffix || suffix.includes("[") || suffix.includes("/")) {
    return undefined;
  }

  const numericValue = parseFloat(suffix);
  if (Number.isNaN(numericValue) || numericValue < 0) {
    return undefined;
  }

  const pxValue = numericValue * 4;

  for (const [token, tokenPxValue] of Object.entries(tokenMap)) {
    if (Number.isFinite(tokenPxValue) && tokenPxValue === pxValue) {
      return token;
    }
  }

  return findNearestToken(pxValue, tokenMap);
}
