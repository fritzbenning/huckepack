/**
 * Checks if classTokens contain any classes that start with the given prefixes.
 *
 * @param classTokens - Array of Tailwind class tokens to check
 * @param prefixes - Array of prefixes to match against
 * @returns True if any class starts with any of the prefixes
 * @example
 * // Check for expanded classes
 * hasExpandedClasses(["pt-4", "pr-4", "w-10"], ["pt", "pr"])
 * // Returns: true
 *
 * @example
 * // Return false when no matches
 * hasExpandedClasses(["w-10", "h-20"], ["pt", "pr"])
 * // Returns: false
 */
export function hasExpandedClasses(classTokens: string[] | null, prefixes: string[]): boolean {
  if (!classTokens || prefixes.length === 0) return false;
  return classTokens.some((token) => prefixes.some((prefix) => token.startsWith(prefix)));
}

