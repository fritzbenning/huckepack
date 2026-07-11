import type { DesignPropertyConfig } from "@editor/design/registry";

/**
 * Gets the value portion of a class for a feature.
 * For numeric features, extracts the suffix after the last dash.
 *
 * @param config - The design property configuration
 * @param classTokens - Current class tokens
 * @param featurePrefix - The feature prefix to get value for
 * @returns The extracted value, or empty string if not found
 * @example
 * // Get numeric value
 * getClassValue(config, ["w-4"], "width")
 * // Returns: "4"
 *
 * @example
 * // Get enum value (returns full class)
 * getClassValue(config, ["static"], "position")
 * // Returns: "static"
 */

// TODO: Remove it safely. It's legacy.
export function getClassValue(
  config: DesignPropertyConfig,
  classTokens: string[] | null,
  featurePrefix: string
): string {
  const feature = config.features[featurePrefix];
  if (!feature) return "";

  const currentClass = feature.classes.find((cls: string) => classTokens?.includes(cls));
  const classToReturn = currentClass ?? feature.classes[0];

  if (feature.type === "numeric") {
    const lastDashIndex = classToReturn.lastIndexOf("-");
    if (lastDashIndex !== -1) {
      return classToReturn.substring(lastDashIndex + 1);
    }
  }

  return classToReturn;
}
