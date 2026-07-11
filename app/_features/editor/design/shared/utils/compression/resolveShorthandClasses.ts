import { normalizePrefixes } from "../normalize/normalizePrefixes";
import { expandShorthandClass } from "./expandShorthandClass";

export interface ShorthandReplacement {
  shorthand: string;
  remainingClasses: string[];
}

export interface ShorthandResolution {
  shorthandsToDelete: string[];
  shorthandsToReplace: ShorthandReplacement[];
}

/**
 * Resolves shorthand classes when some of their expanded classes are being deleted.
 * If all expanded classes are deleted, the shorthand is deleted.
 * If some remain, the shorthand is replaced with the remaining classes.
 *
 * @param classesToDelete - Array of classes being deleted
 * @param originalClassTokens - Original class tokens including shorthand classes
 * @param prefixesToDelete - Optional array of prefixes to match for deletion
 * @returns Object with shorthands to delete and shorthands to replace with remaining classes
 * @example
 * // Replace shorthand when some classes remain
 * resolveShorthandClasses(["w-10"], ["size-10", "w-10", "h-10"])
 * // Returns: { shorthandsToDelete: [], shorthandsToReplace: [{ shorthand: "size-10", remainingClasses: ["h-10"] }] }
 *
 * @example
 * // Delete shorthand when all classes are deleted
 * resolveShorthandClasses(["w-10", "h-10"], ["size-10", "w-10", "h-10"])
 * // Returns: { shorthandsToDelete: ["size-10"], shorthandsToReplace: [] }
 */
export function resolveShorthandClasses(
  classesToDelete: string[],
  originalClassTokens: string[],
  prefixesToDelete?: string[]
): ShorthandResolution {
  const shorthandsToDelete: string[] = [];
  const shorthandsToReplace: ShorthandReplacement[] = [];
  const classesToDeleteSet = new Set(classesToDelete);
  const normalizedPrefixes = normalizePrefixes(prefixesToDelete);

  const shouldDelete = (expandedClass: string): boolean =>
    classesToDeleteSet.has(expandedClass) ||
    (normalizedPrefixes.length > 0 && normalizedPrefixes.some((prefix) => expandedClass.startsWith(prefix)));

  for (const className of originalClassTokens) {
    const expanded = expandShorthandClass(className);
    if (expanded.length <= 1) continue;

    const remainingClasses = expanded.filter((cls) => !shouldDelete(cls));

    if (remainingClasses.length === 0) {
      shorthandsToDelete.push(className);
    } else if (remainingClasses.length < expanded.length) {
      shorthandsToReplace.push({ shorthand: className, remainingClasses });
    }
  }

  return { shorthandsToDelete, shorthandsToReplace };
}
