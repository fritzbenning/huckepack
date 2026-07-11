import { joinClassTokens } from "./joinClassTokens";
import { splitClassTokens } from "./splitClassTokens";

/**
 * Removes a class token from an existing class string.
 */
export function removeClassToken(existingClasses: string, className: string): string {
  const tokens = splitClassTokens(existingClasses);
  return joinClassTokens(tokens.filter((token) => token !== className));
}

