/**
 * Checks if a class is a gradient stop class (from-, via-, or to-).
 *
 * @param cls - The class name to check
 * @returns True if the class is a gradient stop class
 * @example
 * // Match gradient stop classes
 * isGradientStopClass("from-red-500")
 * // Returns: true
 *
 * @example
 * isGradientStopClass("via-blue-500")
 * // Returns: true
 *
 * @example
 * isGradientStopClass("to-green-500")
 * // Returns: true
 */
export function isGradientStopClass(cls: string): boolean {
  if (cls.startsWith("from-")) return true;
  if (cls.startsWith("via-")) return true;
  if (cls.startsWith("to-")) return true;
  return false;
}

