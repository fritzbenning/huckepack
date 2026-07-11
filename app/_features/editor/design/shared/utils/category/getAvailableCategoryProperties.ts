import type { DesignPropertyKey, DesignPropertyRegistryEntry } from "@editor/design/registry/types";

/**
 * Filters design property registry entries to get available properties.
 * Excludes properties that are already present and checks dependencies (showWhen, requires).
 *
 * @param rules - Array of design property registry entries
 * @param presentProperties - Record of present property keys
 * @returns Array of available design property registry entries
 * @example
 * // Simple: Filter out present properties
 * const available = getAvailableCategoryProperties(allRules, { width: true });
 * // Returns: all rules except width
 *
 * @example
 * // Comprehensive: Handle dependencies
 * const rules = [
 *   { key: "width", ... },
 *   { key: "zIndex", dependencies: { requires: ["position"] }, ... }
 * ];
 * const presentProps = { position: true };
 * const available = getAvailableCategoryProperties(rules, presentProps);
 * // Returns: [{ key: "width" }, { key: "zIndex" }] - zIndex available because position is present
 */
export function getAvailableCategoryProperties(
  rules: DesignPropertyRegistryEntry[],
  presentProperties: Record<DesignPropertyKey, boolean>
): DesignPropertyRegistryEntry[] {
  const availableRules = rules.filter((rule) => {
    if (presentProperties[rule.key]) return false;

    if (rule.dependencies?.showWhen && !rule.dependencies.showWhen(presentProperties)) return false;

    if (rule.dependencies?.requires) {
      return rule.dependencies.requires.every((key) => presentProperties[key]);
    }

    return true;
  });

  return availableRules;
}
