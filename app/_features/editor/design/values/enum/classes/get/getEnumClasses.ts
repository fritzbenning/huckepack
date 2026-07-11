/**
 * Generates enum class names by combining a prefix with values.
 * Example: getEnumClasses("static", ["fixed", "absolute"]) → ["static-fixed", "static-absolute"].
 *
 * @param prefix - The prefix to prepend (empty string for no prefix)
 * @param values - Array of enum values
 * @returns Array of class names
 */
export function getEnumClasses(prefix: string, values: readonly string[]): string[] {
  return values.map((value) => (prefix ? `${prefix}-${value}` : value));
}

