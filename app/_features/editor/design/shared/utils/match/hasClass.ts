/**
 * Checks if a class exists in the class tokens array.
 *
 * @param classTokens - Array of Tailwind class tokens, or null
 * @param className - The class name to check for
 * @returns True if the class exists in the tokens
 * @example
 * // Check if class exists
 * hasClass(["w-10", "h-20"], "w-10")
 * // Returns: true
 *
 * @example
 * // Check for non-existent class
 * hasClass(["w-10", "h-20"], "p-4")
 * // Returns: false
 */

// TODO: Remove it safely. It's legacy.
export function hasClass(classTokens: string[] | null, className: string): boolean {
  if (!classTokens) return false;
  return classTokens.includes(className);
}
