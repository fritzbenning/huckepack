import type { DesignPropertyConfig } from "@editor/design/registry";
import { getCurrentFeatureClass } from "../feature/getCurrentFeatureClass";
import { expandCompressedPrefix } from "../prefix/expandCompressedPrefix";

interface GetUnifiedFallbackClassParams {
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  featurePrefix: string;
  unifiedFeatureKey: string;
}

/**
 * Transforms a unified class to an individual feature class format.
 * Extracts the suffix from the unified class and applies it to the feature prefix.
 *
 * @param params - Parameters object
 * @param params.config - The design property configuration
 * @param params.classTokens - Array of Tailwind class tokens
 * @param params.featurePrefix - The prefix for the individual feature (e.g., "pl")
 * @param params.unifiedFeatureKey - The unified feature key (e.g., "padding")
 * @returns The transformed class name, or empty string if unified class doesn't exist
 * @example
 * // Transform unified class to individual
 * getUnifiedFallbackClass({ config, classTokens: ["p-4"], featurePrefix: "pl", unifiedFeatureKey: "padding" })
 * // Returns: "pl-4"
 *
 * @example
 * // Return empty when no unified class
 * getUnifiedFallbackClass({ config, classTokens: ["px-4"], featurePrefix: "pl", unifiedFeatureKey: "padding" })
 * // Returns: ""
 */
export function getUnifiedFallbackClass({
  config,
  classTokens,
  featurePrefix,
  unifiedFeatureKey,
}: GetUnifiedFallbackClassParams): string {
  const unifiedClass = getCurrentFeatureClass(config, classTokens, unifiedFeatureKey);
  if (!unifiedClass) return "";

  const unifiedFeature = config.features[unifiedFeatureKey];

  return expandCompressedPrefix(unifiedClass, unifiedFeature?.prefix ?? unifiedFeatureKey, featurePrefix);
}
