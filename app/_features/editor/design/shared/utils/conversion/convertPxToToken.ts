import type { TokenMap } from "@editor/design/values/token/types";
import { findNearestToken } from "./findNearestToken";

/**
 * Converts a px value to a token name.
 *
 * @param pxValue - The px value to convert
 * @param tokenMap - Token map mapping tokens to px values
 * @returns The token name, or undefined if conversion fails
 * @example
 * // Simple: Convert exact px match to token
 * convertPxToToken(16, { xs: 8, sm: 16, md: 24 }); // "sm"
 *
 * @example
 * // Comprehensive: Handle various scenarios
 * convertPxToToken(16, { sm: 16 }); // "sm" - exact match
 * convertPxToToken(18, { sm: 16, md: 24 }); // "sm" - nearest match
 * convertPxToToken(NaN, { sm: 16 }); // undefined - invalid input
 * convertPxToToken(Infinity, { sm: 16 }); // undefined - invalid input
 */
export function convertPxToToken(pxValue: number, tokenMap: TokenMap): string | undefined {
  if (!Number.isFinite(pxValue)) {
    return;
  }

  for (const [token, tokenPxValue] of Object.entries(tokenMap)) {
    if (Number.isFinite(tokenPxValue) && tokenPxValue === pxValue) {
      return token;
    }
  }

  return findNearestToken(pxValue, tokenMap);
}
