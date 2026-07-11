import { normalizePrefix } from "../normalize/normalizePrefix";

/**
 * Checks if the given class tokens contain any individual corner classes.
 * Individual corners are: {prefix}-tl-*, {prefix}-tr-*, {prefix}-br-*, {prefix}-bl-*
 *
 * @param classTokens - Array of Tailwind class tokens to check
 * @param prefix - The prefix to check for (e.g., "rounded")
 * @returns True if any individual corner classes are found
 * @example
 * // Simple: Check for individual corner classes
 * hasIndividualCorners(["rounded-tl-4", "rounded-tr-4"], "rounded"); // true
 *
 * @example
 * // Comprehensive: Various corner scenarios
 * hasIndividualCorners(["rounded-tl-lg", "w-10"], "rounded"); // true - has top-left
 * hasIndividualCorners(["rounded-br-xl"], "rounded"); // true - has bottom-right
 * hasIndividualCorners(["rounded-bl-none"], "rounded"); // true - has bottom-left
 * hasIndividualCorners(["rounded-4", "w-10"], "rounded"); // false - unified, not individual
 * hasIndividualCorners(null, "rounded"); // false - null input
 * hasIndividualCorners([], "rounded"); // false - empty array
 */
export function hasIndividualCorners(classTokens: string[] | null, prefix: string): boolean {
  if (!classTokens) return false;
  const normalizedPrefix = normalizePrefix(prefix);
  return classTokens.some(
    (token) =>
      token.startsWith(`${normalizedPrefix}tl-`) ||
      token.startsWith(`${normalizedPrefix}tr-`) ||
      token.startsWith(`${normalizedPrefix}br-`) ||
      token.startsWith(`${normalizedPrefix}bl-`)
  );
}
