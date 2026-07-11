import { normalizePrefix } from "@editor/design/shared/utils";
import type { TokenMap } from "../types";

/**
 * Extracts the token name from a Tailwind class name.
 * Removes the prefix and extracts the token name after the dash,
 * then validates it exists in the token map.
 *
 * Example: extractTokenValue("w-sm", "w", { sm: 0.5, md: 1 }) → "sm"
 * Example: extractTokenValue("rounded-md", "rounded", { sm: 0.25, md: 0.375 }) → "md"
 * Example: extractTokenValue("w-10", "w", { sm: 0.5 }) → null (not a token class)
 * Example: extractTokenValue("w", "w", { "": 0.5, sm: 0.5 }) → "sm" (matches default token)
 *
 * @param currentClass - The Tailwind class name to parse
 * @param classPrefix - The property prefix (e.g., "w", "rounded")
 * @param tokens - Token map for validation
 * @returns The token name if valid, or null if not found
 */
export function extractTokenValue(currentClass: string | null, classPrefix: string, tokens: TokenMap): string | null {
  if (!currentClass) return null;

  // TODO: Revisit
  if (currentClass === classPrefix) {
    const defaultToken = tokens[""];
    if (defaultToken !== undefined) {
      for (const [token, value] of Object.entries(tokens)) {
        if (value === defaultToken && token !== "") {
          return token;
        }
      }

      return "";
    }
  }

  const normalizedPrefix = normalizePrefix(classPrefix);

  if (!currentClass.startsWith(normalizedPrefix)) {
    return null;
  }

  const tokenName = currentClass.substring(normalizedPrefix.length);

  if (tokenName && tokenName in tokens) {
    return tokenName;
  }

  return null;
}
