import type { DesignPropertyFeatureType } from "../../types";
import type { StringFeature } from "../types";

/**
 * Type guard to check if a feature is a string feature.
 *
 * @param feature - The feature to check
 * @returns True if the feature is a string feature
 * @example
 * // Simple: Check if feature accepts string values
 * if (isStringFeature(feature)) {
 *   console.log("Supports arbitrary string values");
 * }
 *
 * @example
 * // Comprehensive: Handle string-based properties
 * const feature = config.features.fontFamily;
 * if (isStringFeature(feature)) {
 *   // Create arbitrary string class
 *   const className = createStringClass("font", "Inter"); // "font-[Inter]"
 * }
 */
export function isStringFeature(feature: DesignPropertyFeatureType): feature is StringFeature {
  return feature.type === "string";
}
