import type { DesignPropertyFeatureType, PercentValueFeature } from "@editor/design/values/types";

/**
 * Type guard to check if a percentValue feature.
 *
 * @param feature - The feature to check
 * @returns True if the feature is a percentValue feature
 * @example
 * // Simple: Check if feature is percent-based
 * if (isPercentFeature(feature)) {
 *   console.log("Uses percentage values");
 * }
 *
 * @example
 * // Comprehensive: Access percent-specific configuration
 * const feature = config.features.opacity;
 * if (isPercentFeature(feature)) {
 *   const range = feature.range; // { min: 0, max: 100 }
 *   const exactValues = feature.exactValues; // [0, 25, 50, 75, 100]
 *   const display = feature.displayAs; // "decimal" or "percent"
 * }
 */
export function isPercentFeature(feature: DesignPropertyFeatureType): feature is PercentValueFeature {
  return feature.type === "percentValue";
}
