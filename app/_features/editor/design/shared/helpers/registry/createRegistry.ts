import type { DesignPropertyKey, DesignPropertyRegistryEntry } from "@editor/design/registry/types";

/**
 * Creates a registry object from an array of design property registry entries.
 * Maps each rule by its key property.
 *
 * @param rules - Array of design property registry entries
 * @returns Record mapping property keys to registry entries
 * @example
 * // Create registry from rules
 * createRegistry([{ key: "width", ... }, { key: "height", ... }])
 * // Returns: { width: {...}, height: {...} }
 */
export function createRegistry(
  rules: DesignPropertyRegistryEntry[]
): Record<DesignPropertyKey, DesignPropertyRegistryEntry> {
  return rules.reduce(
    (acc, rule) => {
      acc[rule.key] = rule;
      return acc;
    },
    {} as Record<DesignPropertyKey, DesignPropertyRegistryEntry>
  );
}
