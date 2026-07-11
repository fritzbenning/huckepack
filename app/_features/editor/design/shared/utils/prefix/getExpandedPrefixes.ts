import type { DesignPropertyConfig } from "@editor/design/registry";
import { normalizePrefix } from "../normalize/normalizePrefix";

/**
 * Gets all expanded prefixes (individual + axis) from config.
 * Returns both normalized and original prefixes for use with hasExpandedClasses.
 *
 * @param config - The design property configuration with individualMode config
 * @returns Object with normalized and original prefix arrays
 * @example
 * // Simple: Get expanded prefixes for padding
 * getExpandedPrefixes(paddingConfig);
 * // { normalized: ["pl-", "pr-", "pt-", "pb-", "px-", "py-"], original: ["pl", "pr", "pt", "pb", "px", "py"] }
 *
 * @example
 * // Comprehensive: Different configurations
 * getExpandedPrefixes(marginConfig);
 * // Returns individual + axis prefixes: ["ml", "mr", "mt", "mb", "mx", "my"]
 *
 * getExpandedPrefixes(widthConfig);
 * // Returns: { normalized: [], original: [] } - no individualMode
 */
export function getExpandedPrefixes(config: DesignPropertyConfig): {
  normalized: string[];
  original: string[];
} {
  if (!config.individualMode) return { normalized: [], original: [] };

  const prefixes: string[] = [];

  // Get prefixes from individual features
  if (config.individualMode.individual) {
    for (const featureKey of config.individualMode.individual) {
      const feature = config.features[featureKey];
      prefixes.push(feature.prefix);
    }
  }

  // Get prefixes from axis features
  if (config.individualMode.axis) {
    for (const featureKey of config.individualMode.axis) {
      const feature = config.features[featureKey];
      prefixes.push(feature.prefix);
    }
  }

  return {
    normalized: prefixes.map((prefix) => normalizePrefix(prefix)),
    original: prefixes,
  };
}
