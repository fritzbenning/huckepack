import type { DesignPropertyConfig } from "@editor/design/registry";
import { findAxisFeatureKey } from "../axis/findAxisFeatureKey";
import { findClassByPrefix } from "./findClassByPrefix";

/**
 * Finds an axis class for individual feature mode.
 * Determines the appropriate axis (x or y) based on the feature prefix and finds matching classes.
 *
 * @param config - The design property configuration
 * @param classTokens - Array of Tailwind class tokens to search
 * @param featurePrefix - The feature prefix to find axis class for
 * @returns The matching axis class name, or null if not found
 * @example
 * // Find x-axis class for left/right feature
 * findAxisClassForIndividual(config, ["px-4", "py-2"], "paddingLeft")
 * // Returns: "px-4"
 */

// TODO: Remove it safely. It's legacy.
export function findAxisClassForIndividual(
  config: DesignPropertyConfig,
  classTokens: string[] | null,
  featurePrefix: string
): string | null {
  if (!config.individualMode?.axis || !classTokens) return null;

  const feature = config.features[featurePrefix];
  if (!feature) return null;

  const axisFeatureKey = findAxisFeatureKey(config, feature.prefix);
  if (!axisFeatureKey) return null;

  const axisFeature = config.features[axisFeatureKey];
  if (!axisFeature) return null;

  const axisClass = findClassByPrefix(classTokens, axisFeature.prefix);

  return axisClass && typeof axisClass === "string" ? axisClass : null;
}
