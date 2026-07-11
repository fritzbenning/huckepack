import type { PercentFeature } from "../types";

/**
 * Converts a display value to an internal value using the feature's displayAs setting.
 * Default behavior (percent): divides by 100 (e.g., 50 → 0.5)
 * Decimal: no conversion (e.g., 50 → 50)
 *
 * @param display - Display value (e.g., percentage 0-100)
 * @param feature - The percent value feature configuration
 * @returns Internal value (typically 0-1 range for percent, same as display for decimal)
 */
export function toInternal(display: number, feature: PercentFeature): number {
  return feature.displayAs === "decimal" ? display : display / 100;
}

/**
 * Converts an internal value to a display value using the feature's displayAs setting.
 * Default behavior (percent): multiplies by 100 (e.g., 0.5 → 50)
 * Decimal: no conversion (e.g., 0.5 → 0.5)
 *
 * @param internal - Internal value (typically 0-1 range for percent)
 * @param feature - The percent value feature configuration
 * @returns Display value (e.g., percentage 0-100 for percent, same as internal for decimal)
 */
export function toDisplay(internal: number, feature: PercentFeature): number {
  return feature.displayAs === "decimal" ? internal : internal * 100;
}

