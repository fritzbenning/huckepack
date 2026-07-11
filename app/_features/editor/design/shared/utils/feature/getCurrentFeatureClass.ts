import type { DesignPropertyConfig } from "@editor/design/registry";
import { isNumericFeature } from "@editor/design/values/numeric";
import type { NumericFeature } from "@editor/design/values/numeric/types";
import { findClassByClassifier, findClassByPrefix } from "../find";
import { findClassByConfig } from "../find/findClassByConfig";
import { findClassFromCompressedFeature } from "../find/findClassFromCompressedFeature";

/**
 * Finds the Tailwind class name for a given feature from the class tokens.
 * Uses classifier matching first for intelligent differentiation (e.g., text-red-500 vs text-sm),
 * then falls back to prefix or predefined class matching.
 *
 * Handles compressed/shorthand features by expanding them (e.g., size-10 → w-10 for width feature).
 *
 * @param config - The design property configuration
 * @param classTokens - Array of Tailwind class tokens to search in
 * @param featurePrefix - The feature key to find the class for
 * @returns The matching class name, or null if not found
 *
 * @example
 * // Find width from numeric feature
 * getCurrentFeatureClass(config, ["w-10", "h-20", "p-4"], "width")
 * // Returns: "w-10"
 *
 * @example
 * // Find height from numeric feature
 * getCurrentFeatureClass(config, ["w-10", "h-20", "p-4"], "height")
 * // Returns: "h-20"
 *
 * @example
 * // Classifier distinguishes text color from text size (both start with "text-")
 * getCurrentFeatureClass(textConfig, ["text-red-500", "text-sm", "font-bold"], "textColor")
 * // Returns: "text-red-500"
 *
 * @example
 * // Classifier distinguishes text size from text color
 * getCurrentFeatureClass(textConfig, ["text-red-500", "text-sm", "font-bold"], "fontSize")
 * // Returns: "text-sm"
 *
 * @example
 * // Shorthand expansion: size-10 expands to w-10 for width feature
 * getCurrentFeatureClass(config, ["size-10", "p-4", "bg-red-500"], "width")
 * // Returns: "w-10" (expanded from size-10)
 */
export function getCurrentFeatureClass<T extends string>(
  config: DesignPropertyConfig,
  classTokens: string[] | null | undefined,
  featurePrefix: string
): T | null {
  const feature = config.features[featurePrefix];

  if (!feature || !classTokens?.length) return null;

  if (isNumericFeature(feature)) {
    const numericFeature = feature as NumericFeature;

    if (numericFeature.compressedPrefix) {
      if (config.features[numericFeature.compressedPrefix]) {
        const compressedFeature = config.features[numericFeature.compressedPrefix];

        const result = findClassFromCompressedFeature<T>(classTokens, compressedFeature, feature);

        if (result) {
          return result;
        }
      }
    }
  }

  const classifierMatch = findClassByClassifier(classTokens, featurePrefix);

  if (classifierMatch) return classifierMatch as T;

  if (feature.type === "numeric") {
    return (findClassByPrefix(classTokens, feature.prefix, feature.classFilter) as T) ?? null;
  }

  if (feature.type === "color") {
    return (findClassByPrefix(classTokens, feature.prefix) as T) ?? null;
  }

  return (findClassByConfig(classTokens, feature.classes) as T) ?? null;
}
