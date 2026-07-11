import type { DesignPropertyConfig } from "@editor/design/registry";
import { isNumericFeature } from "@editor/design/values/numeric";
import type { NumericFeature } from "@editor/design/values/numeric/types";

/**
 * Gets the compression prefix from a numeric feature configuration.
 *
 * @param feature - The feature configuration
 * @returns The compression prefix, or null if not a numeric feature or no compression prefix
 * @example
 * // Get compression prefix from numeric feature
 * getCompressionPrefixFromFeature(numericFeature)
 * // Returns: "size" (if feature has compressedPrefix: "size")
 *
 * @example
 * // Return null for non-numeric feature
 * getCompressionPrefixFromFeature(colorFeature)
 * // Returns: null
 */
export function getCompressionPrefixFromFeature(feature: DesignPropertyConfig["features"][string]): string | null {
  if (isNumericFeature(feature)) {
    const numericFeature = feature as NumericFeature;

    const compressedPrefix = numericFeature.compressedPrefix ?? null;

    return compressedPrefix;
  }

  return null;
}
