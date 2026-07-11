import { DESIGN_PROPERTY_CONFIG_REGISTRY } from "@editor/design/registry/properties";
import type { DesignPropertyConfig, DesignPropertyKey } from "@editor/design/registry/types";
import { getCurrentFeatureClass } from "../feature/getCurrentFeatureClass";

// Cache feature keys per config (computed once at module load)
const FEATURE_KEYS_CACHE = new Map<DesignPropertyConfig, string[]>();
const PROPERTY_NAMES = Object.keys(DESIGN_PROPERTY_CONFIG_REGISTRY) as DesignPropertyKey[];

for (const config of Object.values(DESIGN_PROPERTY_CONFIG_REGISTRY)) {
  FEATURE_KEYS_CACHE.set(config, Object.keys(config.features));
}

/**
 * Determines which design properties are present based on class tokens.
 * Loops through each property and checks if any of its features have a matching class.
 * Uses intelligent matching via getCurrentFeatureClass (classifier, prefix, shorthand expansion).
 *
 * @param classTokens - Array of Tailwind class tokens
 * @returns Record mapping property keys to boolean indicating presence
 * @example
 * // Get present design properties
 * getPresentDesignProperties(["w-10", "h-20", "bg-red-500"])
 * // Returns: { width: true, height: true, backgroundColor: true, ... }
 *
 * @example
 * // Classifier distinguishes text color from text size
 * getPresentDesignProperties(["text-red-500", "text-sm"])
 * // Returns: { textColor: true, fontSize: true, ... }
 *
 * @example
 * // Handles shorthand expansion
 * getPresentDesignProperties(["size-10"])
 * // Returns: { width: true, height: true, ... }
 */
export function getPresentDesignProperties(classTokens: string[]): Record<DesignPropertyKey, boolean> {
  const present: Record<DesignPropertyKey, boolean> = {} as Record<DesignPropertyKey, boolean>;

  // Early exit for empty tokens
  if (classTokens.length === 0) {
    for (const propertyName of PROPERTY_NAMES) {
      present[propertyName] = false;
    }
    return present;
  }

  for (const [propertyName, config] of Object.entries(DESIGN_PROPERTY_CONFIG_REGISTRY)) {
    const featureKeys = FEATURE_KEYS_CACHE.get(config)!;
    present[propertyName as DesignPropertyKey] = featureKeys.some((featureKey) => {
      return getCurrentFeatureClass(config, classTokens, featureKey) !== null;
    });
  }

  return present;
}
