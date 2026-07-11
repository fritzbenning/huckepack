import { normalizePrefix } from "../normalize/normalizePrefix";

/**
 * Extracts the suffix from a Tailwind class name given a prefix.
 *
 * @param className - The full class name (e.g., "pt-4")
 * @param prefix - The prefix to extract suffix from (e.g., "pt")
 * @returns The suffix value, or null if prefix doesn't match
 * @example
 * // Simple: Extract suffix from class
 * extractSuffix("pt-4", "pt"); // "4"
 * 
 * @example
 * // Comprehensive: Various extraction scenarios
 * extractSuffix("w-10", "w"); // "10"
 * extractSuffix("w-[100px]", "w"); // "[100px]" - arbitrary values
 * extractSuffix("w-auto", "w"); // "auto" - enum values
 * extractSuffix("w-1/2", "w"); // "1/2" - fractions
 * extractSuffix("pt-4", "pb"); // null - prefix mismatch
 * extractSuffix("w", "w"); // "" - no suffix (base class)
 */
export function extractSuffix(className: string, prefix: string): string | null {
  if (!className.startsWith(prefix)) {
    return null;
  }

  const exactPrefix = normalizePrefix(prefix);
  if (!className.startsWith(exactPrefix)) {
    return null;
  }

  return className.substring(exactPrefix.length);
}

