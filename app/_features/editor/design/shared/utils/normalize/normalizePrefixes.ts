import { normalizePrefix } from "./normalizePrefix";

/**
 * Normalizes multiple prefixes.
 *
 * @param prefixes - Optional array of prefixes to normalize
 * @returns Array of normalized prefixes
 * @example
 * // Simple: Normalize array of prefixes
 * normalizePrefixes(["w", "h", "p-"]); // ["w-", "h-", "p-"]
 *
 * @example
 * // Comprehensive: Handle various inputs
 * normalizePrefixes(["pt", "pr", "pb-", "pl"]); // ["pt-", "pr-", "pb-", "pl-"]
 * normalizePrefixes([]); // [] - empty array
 * normalizePrefixes(undefined); // [] - undefined returns empty array
 * normalizePrefixes(); // [] - no argument returns empty array
 */
export function normalizePrefixes(prefixes?: string[]): string[] {
  return prefixes?.map((prefix) => normalizePrefix(prefix)) ?? [];
}
