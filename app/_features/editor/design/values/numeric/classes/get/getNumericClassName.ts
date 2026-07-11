import type { DesignPropertyConfig } from "@editor/design/registry";
import { isNumericFeature } from "../../check/isNumericFeature";

/**
 * Normalizes a target class name for a numeric feature.
 * If the target class doesn't include a dash and the feature is numeric,
 * prepends the feature prefix.
 * Example: getNumericClassName(feature, "width", "4") → "w-4".
 *
 * @param feature - The feature configuration
 * @param featurePrefix - The feature prefix (used as prefix if needed)
 * @param targetClass - The target class (may be partial like "4")
 * @returns The normalized class name
 */
export function getNumericClassName(
  feature: DesignPropertyConfig["features"][string],
  featurePrefix: string,
  targetClass: string
): string {
  if (isNumericFeature(feature) && !targetClass.includes("-")) {
    return `${featurePrefix}-${targetClass}`;
  }

  return targetClass;
}
