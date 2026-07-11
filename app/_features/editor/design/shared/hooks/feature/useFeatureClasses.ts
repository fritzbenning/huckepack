import type { DesignPropertyConfig } from "@editor/design/registry";
import { getCurrentFeatureClass } from "@editor/design/shared/utils";
import { getAxisFallbackClass, getUnifiedFallbackClass } from "@editor/design/shared/utils/fallback";
import { useMemo } from "react";

interface FeatureConfig {
  prefix: string;
  compressedPrefix?: string | null;
  unifiedPrefix?: string;
}

interface UseFeatureClassesParams<T extends readonly FeatureConfig[]> {
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  features: T;
}

type FeaturePrefix<T extends readonly FeatureConfig[]> = T[number]["prefix"];

type FeatureClassesReturn<T extends readonly FeatureConfig[]> = {
  [K in FeaturePrefix<T>]: string;
} & {
  [K in FeaturePrefix<T> as `has${Capitalize<K>}`]: boolean;
};

/**
 * Hook that returns class names and boolean flags for multiple features.
 * Supports optional compressed/unified prefix fallback logic per feature.
 *
 * @example
 * // Single feature with compressed prefix
 * const { width } = useFeatureClasses({
 *   config,
 *   classTokens,
 *   features: [{ prefix: "width", compressedPrefix: "size" }]
 * });
 * const currentClass = width;
 *
 * @example
 * // Multiple features
 * const { hasOverflowX, hasOverflowY } = useFeatureClasses({
 *   config,
 *   classTokens,
 *   features: [
 *     { prefix: "overflow" },
 *     { prefix: "overflowX" },
 *     { prefix: "overflowY" }
 *   ]
 * });
 *
 * @param config - The design property configuration
 * @param classTokens - Array of Tailwind class tokens
 * @param features - Array of feature configurations with optional fallback options
 * @returns Object with direct feature properties (e.g., width, height) and individual has{FeaturePrefix} boolean flags
 */
export function useFeatureClasses<T extends readonly FeatureConfig[]>({
  config,
  classTokens,
  features,
}: UseFeatureClassesParams<T>): FeatureClassesReturn<T> {
  return useMemo(() => {
    const result: Record<string, string | boolean> = {};

    for (const feature of features) {
      const { prefix, unifiedPrefix } = feature;

      let className = "";

      // Fallback to direct lookup
      if (!className) {
        className = getCurrentFeatureClass(config, classTokens, prefix) ?? "";
      }

      // Try axis fallback (e.g., px-10 → pl-10) if this is an individual feature
      if (!className && config.individualMode?.individual?.includes(prefix)) {
        const feature = config.features[prefix];

        className = getAxisFallbackClass({
          config,
          classTokens,
          featurePrefix: feature.prefix,
        });
      }

      // Try unified prefix fallback if no axis result
      if (!className && unifiedPrefix) {
        const feature = config.features[prefix];

        className = getUnifiedFallbackClass({
          config,
          classTokens,
          featurePrefix: feature.prefix,
          unifiedFeatureKey: unifiedPrefix,
        });
      }

      const hasClass = className !== "";

      result[prefix] = className;
      const capitalizedKey = prefix.charAt(0).toUpperCase() + prefix.slice(1);

      result[`has${capitalizedKey}`] = hasClass;
    }

    return result as FeatureClassesReturn<T>;
  }, [config, classTokens, features]);
}
