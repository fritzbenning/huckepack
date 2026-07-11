/**
 * Normalizes a Tailwind prefix by adding or removing a trailing dash.
 * By default, ensures the prefix ends with a dash.
 *
 * @param prefix - The prefix to normalize
 * @param removeDash - If true, removes trailing dash instead of adding it
 * @returns Normalized prefix
 * @example
 * // Simple: Add trailing dash
 * normalizePrefix("w"); // "w-"
 *
 * @example
 * // Comprehensive: Various normalization scenarios
 * normalizePrefix("p-"); // "p-" - already has dash
 * normalizePrefix("w", false); // "w-" - explicitly add dash
 * normalizePrefix("w-", true); // "w" - remove dash
 * normalizePrefix("pt", false); // "pt-" - add dash to multi-char
 * normalizePrefix("px-", true); // "px" - remove dash from multi-char
 * normalizePrefix(""); // "-" - add dash to empty string
 */
export function normalizePrefix(prefix: string, removeDash?: boolean): string {
  if (removeDash) {
    return prefix.endsWith("-") ? prefix.slice(0, -1) : prefix;
  }
  return prefix.endsWith("-") ? prefix : `${prefix}-`;
}
