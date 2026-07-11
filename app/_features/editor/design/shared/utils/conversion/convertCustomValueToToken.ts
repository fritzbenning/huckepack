import { convertNumericValueToUnit } from "@editor/design/values/numeric/value/convertNumericValueToUnit";
import { extractNumericValue } from "@editor/design/values/numeric/value/extractNumericValue";
import type { TokenMap } from "@editor/design/values/token/types";
import { convertPxToToken } from "./convertPxToToken";

/**
 * Converts a custom value Tailwind class to a token name.
 * Finds the nearest token if exact match doesn't exist.
 *
 * @param customValue - The Tailwind class with arbitrary value (e.g., "w-[16px]", "w-[1em]")
 * @param tokenMap - Token map mapping tokens to rem values
 * @param property - The property prefix (e.g., "w")
 * @returns The token name, or undefined if conversion fails
 * @example
 * // Simple: Convert px custom value to token
 * convertCustomValueToToken("w-[16px]", { sm: 16 }, "w"); // "sm"
 *
 * @example
 * // Comprehensive: Handle various unit types
 * convertCustomValueToToken("w-[16px]", { sm: 16, md: 24 }, "w"); // "sm" - px to token
 * convertCustomValueToToken("w-[1em]", { sm: 16 }, "w"); // "sm" - em to token (1em = 16px)
 * convertCustomValueToToken("w-[1rem]", { sm: 16 }, "w"); // "sm" - rem to token (1rem = 16px)
 * convertCustomValueToToken("w-10", { sm: 16 }, "w"); // undefined - not arbitrary value
 */
export function convertCustomValueToToken(
  customValue: string,
  tokenMap: TokenMap,
  property: string
): string | undefined {
  if (!customValue) return undefined;

  const { value, unit } = extractNumericValue(customValue, property);

  if (!value || !unit) {
    return;
  }

  const pxValue = convertNumericValueToUnit(value, unit, "px");

  if (!pxValue || !Number.isFinite(pxValue)) {
    return;
  }

  return convertPxToToken(pxValue, tokenMap);
}
