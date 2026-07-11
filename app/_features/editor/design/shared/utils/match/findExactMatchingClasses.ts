/**
 * Finds all classes in classTokens that exactly match any of the exactClasses.
 *
 * @param classTokens - Array of Tailwind class tokens to search
 * @param exactClasses - Array of exact class names to match
 * @returns Array of matching class names
 * @example
 * // Find exact matching classes
 * findExactMatchingClasses(["static", "relative", "w-10"], ["static", "fixed"])
 * // Returns: ["static"]
 */
export function findExactMatchingClasses(classTokens: string[], exactClasses: string[]): string[] {
  const matchingClasses: string[] = [];

  for (const className of exactClasses) {
    if (classTokens.includes(className)) {
      matchingClasses.push(className);
    }
  }

  return matchingClasses;
}

