/**
 * Checks if a class matches a background color pattern.
 * Matches standard color classes, color names with opacity, and arbitrary color values.
 *
 * @param cls - The class name to check
 * @param colorKeywords - Array of color keywords (e.g., "transparent", "current")
 * @param colorNames - Array of color names (e.g., "red", "blue")
 * @returns True if the class matches a background color pattern
 * @example
 * // Match standard color keyword
 * matchesBackgroundColor("bg-transparent", ["transparent"], [])
 * // Returns: true
 *
 * @example
 * // Match color name with opacity
 * matchesBackgroundColor("bg-red-500", [], ["red"])
 * // Returns: true
 *
 * @example
 * // Match arbitrary color value
 * matchesBackgroundColor("bg-[#ff0000]", [], [])
 * // Returns: true
 */
export function matchesBackgroundColor(cls: string, colorKeywords: string[], colorNames: string[]): boolean {
  if (!cls.startsWith("bg-")) return false;

  const suffix = cls.slice(3);

  if (colorKeywords.includes(suffix)) return true;

  const colorMatch = suffix.match(/^([a-z]+)-(\d+)/);
  if (colorMatch && colorNames.includes(colorMatch[1])) return true;

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

