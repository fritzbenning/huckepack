import { COLOR_KEYWORDS, COLOR_NAMES } from "@editor/design/shared/helpers/classifier/text/constants";

/**
 * Checks if a class matches a text color pattern.
 * Matches standard color keywords, color names with opacity, and arbitrary color values.
 *
 * @param cls - The class name to check
 * @returns True if the class matches a text color pattern
 * @example
 * // Match standard color keyword
 * matchesTextColor("text-transparent")
 * // Returns: true
 *
 * @example
 * // Match color name with opacity
 * matchesTextColor("text-red-500")
 * // Returns: true
 *
 * @example
 * // Match arbitrary color value
 * matchesTextColor("text-[#ff0000]")
 * // Returns: true
 */
export function matchesTextColor(cls: string): boolean {
  if (!cls.startsWith("text-")) return false;

  const suffix = cls.slice(5);

  if (COLOR_KEYWORDS.includes(suffix)) return true;

  const colorMatch = suffix.match(/^([a-z]+)-(\d+)/);
  if (colorMatch && COLOR_NAMES.includes(colorMatch[1])) return true;

  if (suffix.startsWith("[")) {
    const arbitraryMatch = cls.match(/\[([^\]]+)\]/);
    if (arbitraryMatch) {
      const value = arbitraryMatch[1];
      if (value.startsWith("#")) return true;
      if (value.startsWith("rgb")) return true;
      if (value.startsWith("hsl")) return true;
      if (value.startsWith("oklch")) return true;
      if (value.startsWith("oklab")) return true;
      if (value.startsWith("lab")) return true;
      if (value.startsWith("lch")) return true;
      if (value.startsWith("color(")) return true;
      if (value.startsWith("var(--")) return true;
    }
  }

  return false;
}
