/**
 * Generates directional class variations from a base class key.
 * Returns the base class plus x, y, t, r, b, l directional variants.
 *
 * @param classKey - The base class key (e.g., "p", "m")
 * @returns Array of class keys including base and directional variants
 * @example
 * // Generate directional classes
 * getDirectionalClasses("p")
 * // Returns: ["p", "px", "py", "pt", "pr", "pb", "pl"]
 */
export function getDirectionalClasses(classKey: string): string[] {
  const directions = ["x", "y", "t", "r", "b", "l"];
  return [classKey, ...directions.map((direction) => `${classKey}${direction}`)];
}

