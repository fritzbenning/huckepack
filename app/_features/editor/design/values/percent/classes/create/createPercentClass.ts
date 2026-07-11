import type { PercentFeature } from "../../types";
import { toDisplay, toInternal } from "../../value/convertPercentValue";

/**
 * Formats an internal percent value to a Tailwind class name.
 * Uses standard values if available, otherwise formats as arbitrary value.
 * Converts internal to display value based on feature's displayAs setting.
 *
 * @param internal - Internal value (0-1 range for percent mode, same as display for decimal mode)
 * @param feature - The percent value feature configuration
 * @returns Formatted Tailwind class (e.g., "opacity-50" or "opacity-[0.5]")
 */
export function createPercentClass(internal: number, feature: PercentFeature): string {
  const { prefix, exactValues, range } = feature;

  const minInternal = toInternal(range.min, feature);
  const maxInternal = toInternal(range.max, feature);
  const clamped = Math.max(minInternal, Math.min(maxInternal, internal));

  const displayValue = Math.round(toDisplay(clamped, feature));

  if (exactValues.includes(displayValue)) {
    return `${prefix}${displayValue}`;
  }

  return `${prefix}[${clamped}]`;
}
