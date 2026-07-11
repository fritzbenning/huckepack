import type { DesignPropertyFeatureType, NumericFeature } from "@editor/design/values/types";

/**
 * Type guard to check if a feature is a numeric feature.
 *
 * @param feature - The feature to check
 * @returns True if the feature is a numeric feature
 * @example
 * // Simple: Check if feature supports numeric values
 * if (isNumericFeature(feature)) {
 *   console.log("Supports px, rem, scale units");
 * }
 *
 * @example
 * // Comprehensive: Access numeric-specific properties
 * const feature = config.features.width;
 * if (isNumericFeature(feature)) {
 *   const units = feature.units; // ["scale", "px", "rem", ...]
 *   const defaultUnit = feature.defaultUnit; // "scale"
 *   const extensions = feature.extensions?.arbitrary; // { parse, format }
 * }
 */
export function isNumericFeature(feature: DesignPropertyFeatureType): feature is NumericFeature {
  return feature.type === "numeric";
}
