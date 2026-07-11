import { getScaleClasses } from "./getScaleClasses";

/**
 * Generates scale class names for multiple class keys.
 * Example: getScaleClassesFromArray([4, 8], ["w", "h"]) → ["w-4", "w-8", "h-4", "h-8"].
 *
 * @param scales - Array of scale numbers
 * @param classKeys - Array of class keys/prefixes
 * @returns Array of all class names for all keys
 */
export function getScaleClassesFromArray(scales: number[], classKeys: string[]): string[] {
  return classKeys.flatMap((classKey) => getScaleClasses(classKey, scales));
}

