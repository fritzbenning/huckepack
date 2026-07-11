import type { DesignPropertyConfig } from "@editor/design/registry";
import { getCurrentFeatureClass } from "@editor/design/shared/utils";
import { applySuffix } from "../../../shared/utils/suffix/applySuffix";
import { extractSuffix } from "../../../shared/utils/suffix/extractSuffix";

interface TransformClassesToIndividualParams {
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  unifiedFeatureKey: string;
  individualFeatureKeys: string[];
  extractSuffixFn?: (className: string, prefix: string) => string | null;
  applySuffixFn?: (prefix: string, suffix: string | null) => string;
}

/**
 * Expands a unified class to individual classes.
 * Example: expandUnifiedToIndividual({ config, classTokens: ["p-4"], unifiedFeatureKey: "padding", individualFeatureKeys: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] })
 *   → { classesToRemove: ["p-4"], classesToAdd: ["pt-4", "pr-4", "pb-4", "pl-4"] }
 * Example: With axis mode: ["p-4"] → ["px-4", "py-4"]
 *
 * @param config - The design property configuration
 * @param classTokens - Current class tokens
 * @param unifiedFeatureKey - The unified feature key (e.g., "padding")
 * @param individualFeatureKeys - Array of individual feature keys to expand to
 * @param extractSuffixFn - Optional custom function to extract suffix from class
 * @param applySuffixFn - Optional custom function to apply suffix to prefix
 * @returns Object with classes to remove and classes to add
 */
export function transformClassesToIndividual({
  config,
  classTokens,
  unifiedFeatureKey,
  individualFeatureKeys,
  extractSuffixFn,
  applySuffixFn,
}: TransformClassesToIndividualParams): {
  classesToRemove: string[];
  classesToAdd: string[];
} {
  const classesToRemove: string[] = [];
  const classesToAdd: string[] = [];

  const extract = extractSuffixFn ?? extractSuffix;
  const apply = applySuffixFn ?? applySuffix;

  const currentClass = getCurrentFeatureClass(config, classTokens, unifiedFeatureKey);
  const unifiedFeature = config.features[unifiedFeatureKey];
  const unifiedPrefix = unifiedFeature?.prefix ?? unifiedFeatureKey;

  if (currentClass) {
    const suffix = extract(currentClass, unifiedPrefix);

    classesToRemove.push(currentClass);

    const targetKeys =
      config.individualMode?.axis && config.individualMode.axis.length > 0
        ? config.individualMode.axis
        : individualFeatureKeys;

    for (const key of targetKeys) {
      const feature = config.features[key];
      const prefix = feature?.prefix ?? key;
      const targetClass = apply(prefix, suffix);
      classesToAdd.push(targetClass);
    }
  }

  return {
    classesToRemove,
    classesToAdd,
  };
}
