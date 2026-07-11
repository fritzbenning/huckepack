import { COLOR_KEYWORDS, COLOR_NAMES } from "../constants";

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

