import type { PercentFeature } from "../types";
import { toInternal } from "./convertPercentValue";

/**
 * Parses a Tailwind class name to extract the internal percent value.
 * Handles both standard classes (e.g., "w-50") and arbitrary values (e.g., "w-[0.5]").
 *
 * @param className - The Tailwind class name to parse
 * @param feature - The percent value feature configuration
 * @returns The internal value (0-1 range), or null if parsing fails
 */
export function extractPercentValue(className: string, feature: PercentFeature): number | null {
  if (!className) return null;

  const { prefix, range } = feature;
  const minInternal = toInternal(range.min, feature);
  const maxInternal = toInternal(range.max, feature);

  if (className.startsWith(prefix) && !className.includes("[")) {
    const value = parseFloat(className.slice(prefix.length));
    if (!Number.isNaN(value) && value >= range.min && value <= range.max) {
      return toInternal(value, feature);
    }
  }

  const escaped = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const match = className.match(new RegExp(`^${escaped}\\[(.+)\\]$`));
  if (match) {
    const value = parseFloat(match[1]);
    if (!Number.isNaN(value) && value >= minInternal && value <= maxInternal) {
      return value;
    }
  }

  return null;
}
