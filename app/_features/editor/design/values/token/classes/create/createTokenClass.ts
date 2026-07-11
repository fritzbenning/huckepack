import type { TokenMap } from "../../types";

/**
 * Formats a token name to a Tailwind class name.
 * Example: createTokenClass("sm", "w", tokenMap) → "w-sm".
 *
 * @param token - The token name (e.g., "sm", "md")
 * @param property - The property prefix (e.g., "w")
 * @param tokenMap - Token map for validation
 * @returns Formatted Tailwind class name
 */
export function createTokenClass(token: string, classPrefix: string, tokens: TokenMap): string {
  if (token === "") {
    return classPrefix;
  }

  if (token in tokens) {
    return `${classPrefix}-${token}`;
  }

  return `${classPrefix}-${token}`;
}
