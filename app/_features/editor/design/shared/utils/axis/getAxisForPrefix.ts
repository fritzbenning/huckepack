const HORIZONTAL_SUFFIXES = ["l", "r", "x"];
const VERTICAL_SUFFIXES = ["t", "b", "y"];

/**
 * Determines the axis for a feature prefix by checking both directional and axis suffix patterns.
 * First checks for directional features (top, bottom, left, right), then falls back to
 * axis suffix matching (pt, pb, pl, pr, px, py).
 *
 * @param prefix - The feature prefix to check
 * @returns The axis ("x" or "y") or null if no match
 * @example
 * getAxisForPrefix("top"); // "y" (directional)
 * getAxisForPrefix("pt"); // "y" (axis suffix)
 * getAxisForPrefix("px"); // "x" (axis suffix)
 */
export function getAxisForPrefix(prefix: string): "x" | "y" | null {
  // Check first character for directional features (top, bottom, left, right)
  const firstChar = prefix.charAt(0).toLowerCase();
  if (firstChar === "t" || firstChar === "b") return "y";
  if (firstChar === "l" || firstChar === "r") return "x";

  // Fallback to last character for axis suffix matching (pt, pb, pl, pr, px, py)
  const lastChar = prefix.slice(-1).toLowerCase();
  if (HORIZONTAL_SUFFIXES.includes(lastChar)) return "x";
  if (VERTICAL_SUFFIXES.includes(lastChar)) return "y";
  return null;
}
