import { normalizePrefix } from "../normalize/normalizePrefix";

/**
 * Finds a class that starts with the given prefix in the class tokens.
 * Optionally filters results with a custom filter function.
 *
 * @param classTokens - Array of Tailwind class tokens to search
 * @param prefix - Prefix to search for (e.g., "w", "p")
 * @param classFilter - Optional filter function to further refine matches
 * @returns The matching class name, or undefined if not found
 * @example
 * // Find first class with prefix
 * findClassByPrefix(["w-10", "h-20", "w-auto"], "w")
 * // Returns: "w-10"
 *
 * @example
 * // Find class with prefix and filter
 * findClassByPrefix(["w-10", "w-auto"], "w", (c) => c.includes("auto"))
 * // Returns: "w-auto"
 */
export function findClassByPrefix(
  classTokens: string[],
  prefix: string,
  classFilter?: (cls: string) => boolean
): string | undefined {
  const normalizedPrefix = normalizePrefix(prefix);

  const match = classTokens.find((className) => {
    if (!className.startsWith(normalizedPrefix)) return false;
    if (classFilter && !classFilter(className)) return false;

    return true;
  });

  return match ?? (classTokens.includes(prefix) ? prefix : undefined);
}
