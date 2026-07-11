import { normalizePrefix } from "@editor/design/shared/utils";
import type { TokenMap } from "../types";

/**
 * Checks if any class in classTokens is a token-based class for the given prefix.
 * Handles both simple tokens (e.g., "w-sm") and corner-specific tokens (e.g., "rounded-tl-sm").
 *
 * @param classTokens - Array of Tailwind class tokens to check
 * @param prefix - The property prefix (e.g., "w", "rounded")
 * @param tokenMap - Optional token map for validation
 * @returns True if any token class exists for the prefix
 * @example
 * // Simple: Check for simple token
 * hasTokenClass(["w-sm", "h-20"], "w", { sm: 16 }); // true
 *
 * @example
 * // Comprehensive: Check various token patterns
 * hasTokenClass(["rounded-tl-sm"], "rounded", tokens); // true - corner token
 * hasTokenClass(["w-10"], "w", tokens); // false - numeric, not token
 * hasTokenClass(["w-[100px]"], "w", tokens); // false - arbitrary, not token
 * hasTokenClass(["w-sm"], "w"); // true - matches common token pattern
 */
export function hasTokenClass(classTokens: string[] | null, prefix: string, tokenMap?: TokenMap): boolean {
  if (!classTokens) return false;

  const normalizedPrefix = normalizePrefix(prefix);
  const escapedPrefix = normalizedPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return classTokens.some((token) => {
    if (!token.startsWith(normalizedPrefix) || token.includes("[")) return false;

    if (token === prefix) return true;

    // Match pattern: prefix-corner-token or prefix-token
    // For border-radius: rounded-tl-sm -> corner="tl", token="sm"
    // For width: w-sm -> corner=undefined, token="sm"
    const match = token.match(new RegExp(`^${escapedPrefix}(tl|tr|br|bl)-(.+)$`));
    if (match) {
      const tokenName = match[2];
      if (tokenMap) {
        return tokenName in tokenMap;
      }
      return token.match(
        new RegExp(`^${escapedPrefix}(tl|tr|br|bl)-(none|3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|full)$`)
      );
    }

    // Try without corner modifier: prefix-token
    const matchWithoutCorner = token.match(new RegExp(`^${escapedPrefix}(.+)$`));
    if (matchWithoutCorner) {
      const tokenName = matchWithoutCorner[1];
      if (tokenMap) {
        return tokenName in tokenMap;
      }
      return token.match(new RegExp(`^${escapedPrefix}(none|3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|full)$`));
    }

    return false;
  });
}
