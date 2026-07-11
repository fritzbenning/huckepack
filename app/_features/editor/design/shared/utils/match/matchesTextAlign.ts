/**
 * Checks if a class matches a text alignment pattern.
 *
 * @param cls - The class name to check
 * @returns True if the class matches a text alignment pattern
 * @example
 * // Match text alignment classes
 * matchesTextAlign("text-left")
 * // Returns: true
 *
 * @example
 * matchesTextAlign("text-center")
 * // Returns: true
 */
export function matchesTextAlign(cls: string): boolean {
  return (
    cls.startsWith("text-left") ||
    cls.startsWith("text-center") ||
    cls.startsWith("text-right") ||
    cls.startsWith("text-justify") ||
    cls.startsWith("text-start") ||
    cls.startsWith("text-end")
  );
}

