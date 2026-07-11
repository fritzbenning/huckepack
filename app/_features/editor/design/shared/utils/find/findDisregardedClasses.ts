import type { DesignPropertyConfig } from "@editor/design/registry";
import { isEnumFeature } from "@editor/design/values/enum";

/**
 * Gets all disregarded classes from all enum features in the provided config.
 * Useful when removing a design property to clean up all disregarded classes.
 *
 * @param config - The design property configuration to search
 * @returns Array of all disregarded classes from enum features in the config
 * @example
 * // Get all disregarded classes from position config
 * getAllDisregardedClassesFromConfig(positionConfig)
 * // Returns: ["static"] if position enum feature has disregardedClasses
 */
export function findDisregardedClasses(config: DesignPropertyConfig): string[] {
  const disregardedClasses: string[] = [];

  for (const feature of Object.values(config.features)) {
    if (isEnumFeature(feature) && feature.disregardedClasses) {
      disregardedClasses.push(...feature.disregardedClasses);
    }
  }

  return disregardedClasses;
}
