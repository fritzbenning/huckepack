import { FONT_SIZE_TOKENS } from "@editor/design/shared/helpers/classifier/text/constants";

/**
 * Checks if a class matches a font size pattern.
 * Matches standard font size tokens and arbitrary font size values (excluding color values).
 *
 * @param cls - The class name to check
 * @returns True if the class matches a font size pattern
 * @example
 * // Match standard font size token
 * matchesFontSize("text-sm")
 * // Returns: true
 *
 * @example
 * // Match arbitrary font size
 * matchesFontSize("text-[16px]")
 * // Returns: true
 *
 * @example
 * // Reject color value in arbitrary
 * matchesFontSize("text-[#ff0000]")
 * // Returns: false
 */
export function matchesFontSize(cls: string): boolean {
  const token = cls.replace("text-", "");

  if (FONT_SIZE_TOKENS.includes(token)) return true;

  if (token.startsWith("[") && token.endsWith("]")) {
    const arbitraryMatch = cls.match(/\[([^\]]+)\]/);
    if (arbitraryMatch) {
      const value = arbitraryMatch[1];
      const isColorValue =
        value.startsWith("#") ||
        value.startsWith("rgb") ||
        value.startsWith("hsl") ||
        value.startsWith("oklch") ||
        value.startsWith("oklab") ||
        value.startsWith("lab") ||
        value.startsWith("lch") ||
        value.startsWith("color(") ||
        value.startsWith("var(--");
      if (isColorValue) return false;
      return true;
    }
  }

  return false;
}
