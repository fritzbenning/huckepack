import type { DesignPropertyFeatureType } from "@editor/design/values/types";
import type { EnumFeature } from "../types";

/**
 * Type guard to check if a feature is an enum feature.
 *
 * @param feature - The feature to check
 * @returns True if the feature is an enum feature
 * @example
 * // Simple: Check if feature is enum type
 * if (isEnumFeature(feature)) {
 *   console.log("This is an enum feature");
 * }
 *
 * @example
 * // Comprehensive: Type-safe enum feature handling
 * const feature = config.features.overflow;
 * if (isEnumFeature(feature)) {
 *   const defaultValue = feature.defaultValue; // Type-safe access
 *   const values = feature.classes; // ["overflow-auto", "overflow-hidden", ...]
 * }
 */
export function isEnumFeature(feature: DesignPropertyFeatureType): feature is EnumFeature {
  return feature.type === "enum";
}
