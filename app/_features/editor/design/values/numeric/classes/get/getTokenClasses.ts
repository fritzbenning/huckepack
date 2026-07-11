import type { TokenMap } from "@editor/design/values/token/types";

/**
 * Generates token class names by combining a class key with token names from a TokenMap.
 * Handles empty string tokens by returning just the classKey (e.g., "rounded" instead of "rounded-").
 * Example: getTokenClasses("w", { sm: 24, md: 28, lg: 32 }) → ["w-sm", "w-md", "w-lg"].
 * Example: getTokenClasses("rounded", { "": 0.25, sm: 0.25 }) → ["rounded", "rounded-sm"].
 *
 * @param classKey - The class key/prefix (e.g., "w", "min-w")
 * @param tokenMap - Token map containing token names as keys
 * @returns Array of class names
 */
export function getTokenClasses(classKey: string, tokenMap: TokenMap): string[] {
  return Object.keys(tokenMap).map((token) => (token === "" ? classKey : `${classKey}-${token}`));
}
