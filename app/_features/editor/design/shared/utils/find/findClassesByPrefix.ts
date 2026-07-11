import { normalizePrefix } from "../normalize/normalizePrefix";

export interface FindClassesByPrefixOptions {
  /** Whether to handle variant prefixes (e.g., "md:px-4") */
  handleVariants?: boolean;
}

/**
 * Finds all classes in classTokens that start with any of the given prefixes.
 * Can optionally handle variant prefixes (e.g., "md:px-4").
 *
 * @param classTokens - Array of Tailwind class tokens to search
 * @param prefixes - Array of prefixes to match against
 * @param options - Optional configuration
 * @param options.handleVariants - Whether to handle variant prefixes (e.g., "md:px-4")
 * @returns Array of matching class names
 * @example
 * // Simple: Find classes with multiple prefixes
 * findClassesByPrefix(["w-10", "h-20", "p-4"], ["w", "h"]); // ["w-10", "h-20"]
 *
 * @example
 * // Comprehensive: Variants and edge cases
 * findClassesByPrefix(["md:w-10", "w-20", "hover:p-4"], ["w"], { handleVariants: true }); // ["md:w-10", "w-20"]
 * findClassesByPrefix(["pt-4", "pr-4", "w-10"], ["pt", "pr", "pb", "pl"]); // ["pt-4", "pr-4"]
 * findClassesByPrefix(["w-10"], ["h"]); // [] - no match
 * findClassesByPrefix([], ["w"]); // [] - empty input
 * findClassesByPrefix(["hover:md:w-10"], ["w"], { handleVariants: true }); // ["hover:md:w-10"] - nested variants
 */
export function findClassesByPrefix(
  classTokens: string[],
  prefixes: string[],
  options: FindClassesByPrefixOptions = {}
): string[] {
  const { handleVariants = false } = options;

  if (handleVariants) {
    return classTokens.filter((token) =>
      prefixes.some((prefix) => {
        const normalizedPrefix = normalizePrefix(prefix);
        const variantMatch = token.match(/^([a-z@-]+:)?(.+)$/);
        if (variantMatch) {
          const base = variantMatch[2];
          return base.startsWith(normalizedPrefix) || base === prefix;
        }
        return token.startsWith(normalizedPrefix) || token === prefix;
      })
    );
  }

  const matchingClasses: string[] = [];

  for (const prefix of prefixes) {
    const normalizedPrefix = normalizePrefix(prefix);
    const matching = classTokens.filter((cls) => cls.startsWith(normalizedPrefix));
    matchingClasses.push(...matching);
  }
  return matchingClasses;
}
