import type { DesignPropertyConfig } from "@editor/design/registry";
import { isNumericFeature } from "@editor/design/values/numeric/check";
import type { NumericFeature } from "@editor/design/values/numeric/types";
import type { ArbitraryConfig } from "@editor/design/values/types";

/**
 * Gets the arbitrary extension configuration from a numeric feature.
 *
 * @param feature - The feature configuration
 * @returns The arbitrary configuration, or null if not a numeric feature or no arbitrary extension
 * @example
 * // Simple: Get arbitrary extension from numeric feature
 * const config = getArbitraryExtentionFromFeature(widthFeature);
 * // Returns: { parse: (inner) => ..., format: (value) => ... }
 *
 * @example
 * // Comprehensive: Check and use arbitrary extension
 * const feature = config.features.width;
 * const arbitrary = getArbitraryExtentionFromFeature(feature);
 * if (arbitrary) {
 *   const parsed = arbitrary.parse("100px"); // Extract value from arbitrary class
 *   const formatted = arbitrary.format(100); // Format value as arbitrary class
 * }
 */
export function getArbitraryExtentionFromFeature(
  feature: DesignPropertyConfig["features"][string]
): ArbitraryConfig | null {
  if (isNumericFeature(feature)) {
    const numericFeature = feature as NumericFeature;
    return numericFeature.extensions?.arbitrary ?? null;
  }

  return null;
}
