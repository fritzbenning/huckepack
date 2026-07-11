import { FONT_SIZE_TOKENS } from "../constants";

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
