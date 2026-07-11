import type { DesignPropertyConfig } from "@editor/design/registry";
import { findClassesByPrefix } from "../../../shared/utils/find/findClassesByPrefix";
import { findValueClassByPriority } from "../../../shared/utils/find/findValueClassByPriority";
import { getExpandedPrefixesForKeys } from "../../../shared/utils/prefix/getExpandedPrefixesForKeys";
import { applySuffix } from "../../../shared/utils/suffix/applySuffix";
import { extractSuffix } from "../../../shared/utils/suffix/extractSuffix";

interface TransformClassesToUnifiedParams {
  config: DesignPropertyConfig;
  classTokens: string[];
  unifiedFeatureKey: string;
  individualFeatureKeys: string[];
  extractSuffixFn?: (className: string, prefix: string) => string | null;
  applySuffixFn?: (prefix: string, suffix: string | null) => string;
}

/**
 * Transforms individual classes to a unified class if all values match.
 * Example: transformClassesToUnified({ config, classTokens: ["pt-4", "pr-4", "pb-4", "pl-4"], unifiedFeatureKey: "padding", individualFeatureKeys: [...] })
 *   → { classesToRemove: ["pt-4", "pr-4", "pb-4", "pl-4"], classesToAdd: ["p-4"] }
 * Uses compressPriority to determine which value to use when compressing.
 *
 * @param config - The design property configuration
 * @param classTokens - Current class tokens
 * @param unifiedFeatureKey - The unified feature key (e.g., "padding")
 * @param individualFeatureKeys - Array of individual feature keys to compress
 * @param extractSuffixFn - Optional custom function to extract suffix from class
 * @param applySuffixFn - Optional custom function to apply suffix to prefix
 * @returns Object with classes to remove and classes to add
 */
export function transformClassesToUnified({
  config,
  classTokens,
  unifiedFeatureKey,
  individualFeatureKeys,
  extractSuffixFn,
  applySuffixFn,
}: TransformClassesToUnifiedParams): {
  classesToRemove: string[];
  classesToAdd: string[];
} {
  const classesToRemove: string[] = [];
  const classesToAdd: string[] = [];

  const extract = extractSuffixFn ?? extractSuffix;
  const apply = applySuffixFn ?? applySuffix;

  const unifiedFeature = config.features[unifiedFeatureKey];
  const unifiedPrefix = unifiedFeature?.prefix ?? unifiedFeatureKey;

  const { individualPrefixes, allPrefixes } = getExpandedPrefixesForKeys({
    config,
    individualFeatureKeys,
  });

  const expandedClasses = findClassesByPrefix(classTokens, allPrefixes, { handleVariants: true });

  if (expandedClasses.length > 0) {
    const priority =
      config.individualMode?.compressPriority && config.individualMode.compressPriority.length > 0
        ? config.individualMode.compressPriority
        : individualPrefixes;

    const result = findValueClassByPriority({
      expandedClasses,
      priority,
    });

    if (result) {
      const { valueClass, valuePrefix } = result;
      const suffix = extract(valueClass, valuePrefix);

      classesToRemove.push(...expandedClasses);

      if (suffix) {
        const unifiedClass = apply(unifiedPrefix, suffix);
        classesToAdd.push(unifiedClass);
      }
    }
  }

  return {
    classesToRemove,
    classesToAdd,
  };
}
