/**
 * Generates scale class names by combining a class key with scale values.
 * Example: getScaleClasses("w", [4, 8, 12]) → ["w-4", "w-8", "w-12"].
 *
 * @param classKey - The class key/prefix (e.g., "w", "p")
 * @param scales - Array of scale numbers
 * @returns Array of class names
 */
export function getScaleClasses(classKey: string, scales: number[]): string[] {
  return scales.map((scale: number) => `${classKey}-${scale}`);
}

