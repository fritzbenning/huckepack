import type { DesignPropertyConfig, DesignPropertyRegistryEntry } from "@editor/design/registry/types";

/**
 * Creates a config registry object from an array of design property registry entries.
 * Maps each rule's config by its key property.
 *
 * @param rules - Array of design property registry entries
 * @returns Record mapping property keys to design property configs
 * @example
 * // Create config registry from rules
 * createConfigRegistry([{ key: "width", config: {...} }, { key: "height", config: {...} }])
 * // Returns: { width: {...}, height: {...} }
 */
export function createConfigRegistry(rules: DesignPropertyRegistryEntry[]): Record<string, DesignPropertyConfig> {
  return rules.reduce(
    (acc, rule) => {
      acc[rule.key] = rule.config;
      return acc;
    },
    {} as Record<string, DesignPropertyConfig>
  );
}
