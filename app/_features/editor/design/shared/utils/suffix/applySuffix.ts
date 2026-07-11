import { normalizePrefix } from "../normalize/normalizePrefix";

/**
 * Applies a suffix to a prefix to create a Tailwind class name.
 *
 * @param prefix - The prefix (e.g., "pt")
 * @param suffix - The suffix value (e.g., "4"), or null for base class
 * @returns The complete class name
 * @example
 * // Simple: Apply suffix to create class
 * applySuffix("pt", "4"); // "pt-4"
 *
 * @example
 * // Comprehensive: Various suffix applications
 * applySuffix("w", "10"); // "w-10"
 * applySuffix("w", "[100px]"); // "w-[100px]" - arbitrary value
 * applySuffix("w", "auto"); // "w-auto" - enum value
 * applySuffix("w", "1/2"); // "w-1/2" - fraction
 * applySuffix("p", null); // "p" - null suffix returns base prefix
 * applySuffix("p", ""); // "p" - empty suffix returns base prefix
 */
export function applySuffix(prefix: string, suffix: string | null): string {
  if (!suffix) {
    return prefix;
  }
  const normalizedPrefix = normalizePrefix(prefix);
  return `${normalizedPrefix}${suffix}`;
}
