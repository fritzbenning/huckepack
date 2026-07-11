import { joinClassTokens } from "./joinClassTokens";
import { splitClassTokens } from "./splitClassTokens";

/**
 * Replaces a class token in an existing class string.
 */
export function replaceClassToken(existingClasses: string, oldToken: string, newToken: string): string {
  const tokens = splitClassTokens(existingClasses);
  return joinClassTokens(tokens.map((token) => (token === oldToken ? newToken : token)));
}

