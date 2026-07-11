import type { DesignPropertyConfig } from "@editor/design/registry";
import { findAxisFeatureKey } from "../axis";
import { getCurrentFeatureClass } from "../feature/getCurrentFeatureClass";
import { expandCompressedPrefix } from "../prefix/expandCompressedPrefix";

interface GetAxisFallbackClassParams {
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  featurePrefix: string;
}

/**
 * Gets a fallback class from the axis feature when individual feature class is not found.
 * Example: When classes are ["px-4"] and we're looking for "pl", this returns "pl-4".
 * Also works for directional features: when classes are ["inset-y-20"] and we're looking for "top", this returns "top-20".
 *
 * @param params - Parameters object
 * @param params.config - The design property configuration
 * @param params.classTokens - Array of Tailwind class tokens
 * @param params.featurePrefix - The prefix for the individual feature (e.g., "pl", "top")
 * @returns The transformed class name, or empty string if axis class doesn't exist
 * @example
 * getAxisFallbackClass({ config, classTokens: ["px-4"], featurePrefix: "pl" })
 * // Returns: "pl-4"
 * getAxisFallbackClass({ config, classTokens: ["inset-y-20"], featurePrefix: "top" })
 * // Returns: "top-20"
 */
export function getAxisFallbackClass({ config, classTokens, featurePrefix }: GetAxisFallbackClassParams): string {
  if (!config.individualMode?.axis) return "";

  const axisFeatureKey = findAxisFeatureKey(config, featurePrefix);

  if (!axisFeatureKey) return "";

  const axisClass = getCurrentFeatureClass(config, classTokens, axisFeatureKey);
  if (!axisClass) return "";

  const axisFeature = config.features[axisFeatureKey];

  return expandCompressedPrefix(axisClass, axisFeature?.prefix ?? axisFeatureKey, featurePrefix);
}
