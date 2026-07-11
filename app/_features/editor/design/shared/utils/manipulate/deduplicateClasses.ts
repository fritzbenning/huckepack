/**
 * Deduplicates and flattens multiple arrays of class names into a single array.
 *
 * @param classArrays - Variable number of class name arrays
 * @returns Array of unique class names
 * @example
 * // Simple: Deduplicate and flatten arrays
 * deduplicateClasses(["w-10", "h-20"], ["w-10", "p-4"]); // ["w-10", "h-20", "p-4"]
 *
 * @example
 * // Comprehensive: Multiple arrays with duplicates
 * deduplicateClasses(["w-10"], ["h-20", "w-10"], ["p-4", "h-20"]); // ["w-10", "h-20", "p-4"]
 * deduplicateClasses(["w-10", "w-10"]); // ["w-10"] - duplicates removed
 * deduplicateClasses([], ["w-10"], []); // ["w-10"] - empty arrays ignored
 * deduplicateClasses(); // [] - no arguments returns empty array
 */
export function deduplicateClasses(...classArrays: string[][]): string[] {
  return Array.from(new Set(classArrays.flat()));
}
