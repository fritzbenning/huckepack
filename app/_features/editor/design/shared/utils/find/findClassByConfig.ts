/**
 * Finds the first predefined class from the classes array that exists in classTokens.
 *
 * @param classTokens - Array of Tailwind class tokens to search
 * @param classes - Array of predefined classes to look for
 * @returns The first matching class name, or undefined if none found
 * @example
 * // Simple: Find first matching predefined class
 * findClassByConfig(["static", "relative", "w-10"], ["relative", "absolute"]); // "relative"
 *
 * @example
 * // Comprehensive: Priority and no-match scenarios
 * findClassByConfig(["absolute", "relative"], ["relative", "absolute"]); // "relative" - first in classes array
 * findClassByConfig(["w-10", "h-20"], ["relative", "absolute"]); // undefined - no match
 * findClassByConfig([], ["relative"]); // undefined - empty classTokens
 * findClassByConfig(["relative"], []); // undefined - empty classes array
 */
export function findClassByConfig(classTokens: string[], classes: string[]): string | undefined {
  return classes.find((cls) => classTokens.includes(cls));
}
