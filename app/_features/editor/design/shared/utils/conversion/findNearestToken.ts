import type { TokenMap } from "@editor/design/values/token/types";

/**
 * Finds the nearest token to a given px value by calculating minimum distance.
 *
 * @param pxValue - The px value to find nearest token for
 * @param tokenMap - Token map mapping tokens to px values
 * @returns The nearest token name, or undefined if no valid tokens
 * @example
 * // Simple: Find nearest token
 * findNearestToken(18, { sm: 16, md: 24, lg: 32 }); // "sm" (18 is closest to 16)
 *
 * @example
 * // Comprehensive: Various distance calculations
 * findNearestToken(25, { sm: 16, md: 24, lg: 32 }); // "md" (25 is closest to 24)
 * findNearestToken(15, { xs: 8, sm: 16 }); // "sm" (15 closer to 16 than 8)
 * findNearestToken(12, { xs: 8, sm: 16 }); // "xs" (12 closer to 8 than 16)
 * findNearestToken(NaN, { sm: 16 }); // undefined - invalid input
 * findNearestToken(100, {}); // undefined - empty token map
 */
export function findNearestToken(pxValue: number, tokenMap: TokenMap): string | undefined {
  if (!Number.isFinite(pxValue)) return undefined;

  let nearestToken: string | undefined;
  let minDistance = Infinity;

  for (const [token, tokenPxValue] of Object.entries(tokenMap)) {
    if (!Number.isFinite(tokenPxValue) || token === "") continue;

    const distance = Math.abs(pxValue - tokenPxValue);
    if (distance < minDistance) {
      minDistance = distance;
      nearestToken = token;
    }
  }

  return nearestToken;
}
