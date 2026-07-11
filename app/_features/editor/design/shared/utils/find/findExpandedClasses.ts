import { findClassesByPrefix } from "./findClassesByPrefix";

interface FindExpandedClassesParams {
  classTokens: string[];
  prefixes: string[];
}

/**
 * Finds all classes in classTokens that match any of the given prefixes.
 * Handles variant prefixes (e.g., "md:px-4") correctly.
 *
 * @param params - Parameters object
 * @param params.classTokens - Array of Tailwind class tokens to search
 * @param params.prefixes - Array of prefixes to match against (e.g., ["pt", "pr", "pb", "pl"])
 * @returns Array of matching class names
 * @example
 * // Simple: Find expanded classes
 * findExpandedClasses({ classTokens: ["pt-4", "pr-4", "w-10"], prefixes: ["pt", "pr"] }); // ["pt-4", "pr-4"]
 *
 * @example
 * // Comprehensive: Variants and multiple prefixes
 * findExpandedClasses({ classTokens: ["md:px-4", "py-4", "hover:pl-2"], prefixes: ["px", "py"] }); // ["md:px-4", "py-4"]
 * findExpandedClasses({ classTokens: ["pt-4", "pr-4", "pb-4", "pl-4"], prefixes: ["pt", "pr", "pb", "pl"] }); // all 4 classes
 * findExpandedClasses({ classTokens: ["w-10"], prefixes: ["pt", "pr"] }); // [] - no match
 */
export function findExpandedClasses({ classTokens, prefixes }: FindExpandedClassesParams): string[] {
  return findClassesByPrefix(classTokens, prefixes, { handleVariants: true });
}
