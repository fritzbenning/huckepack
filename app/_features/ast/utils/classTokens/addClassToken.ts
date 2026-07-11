import { joinClassTokens } from "./joinClassTokens";
import { splitClassTokens } from "./splitClassTokens";

/**
 * Adds a class token to an existing class string, avoiding duplicates.
 */
export function addClassToken(existingClasses: string, className: string): string {
  const tokens = splitClassTokens(existingClasses);
  if (!tokens.includes(className)) {
    tokens.push(className);
  }
  return joinClassTokens(tokens);
}

