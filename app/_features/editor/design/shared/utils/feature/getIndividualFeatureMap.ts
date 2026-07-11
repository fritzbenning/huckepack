import type { DesignPropertyConfig } from "@editor/design/registry";
import { isNumericFeature } from "@editor/design/values/numeric";

interface IndividualFeatureMapItem {
  key: string;
  feature: DesignPropertyConfig["features"][string];
  icon?: string;
}

/**
 * Maps individual features from config to an array of feature items with optional icons.
 * Filters out non-numeric features and returns items with key, feature, and optional icon.
 *
 * @param config - The design property configuration
 * @returns Array of individual feature items, with null entries for non-numeric features
 * @example
 * // Get individual feature map
 * getIndividualFeatureMap(config)
 * // Returns: [{ key: "paddingTop", feature: {...}, icon: "↑" }, { key: "paddingRight", feature: {...}, icon: "→" }, ...]
 */
export function getIndividualFeatureMap(config: DesignPropertyConfig): (IndividualFeatureMapItem | null)[] {
  if (!config.individualMode?.individual) {
    return [];
  }

  return config.individualMode.individual.map((key) => {
    const feature = config.features[key as keyof typeof config.features];
    if (!isNumericFeature(feature)) {
      return null;
    }

    const icon = typeof feature.icon === "string" ? feature.icon : undefined;

    return {
      key,
      feature,
      icon,
    };
  });
}
