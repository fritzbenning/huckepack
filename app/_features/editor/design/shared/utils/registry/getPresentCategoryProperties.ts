import type { DesignPropertyKey, DesignPropertyRegistryEntry } from "@editor/design/registry/types";

/**
 * Filters design property registry entries to get present properties.
 * Only includes properties that are present and meet their showWhen dependency requirements.
 *
 * @param rules - Array of design property registry entries
 * @param presentProperties - Record of present property keys
 * @returns Array of present design property registry entries
 * @example
 * // Get present category properties
 * getPresentCategoryProperties(rules, { width: true, height: false })
 * // Returns: [rules that are present and meet dependencies]
 */
export function getPresentCategoryProperties(
  rules: DesignPropertyRegistryEntry[],
  presentProperties: Record<DesignPropertyKey, boolean>
): DesignPropertyRegistryEntry[] {
  return rules.filter((rule) => {
    if (!presentProperties[rule.key]) return false;

    if (rule.dependencies?.showWhen && !rule.dependencies.showWhen(presentProperties)) return false;

    return true;
  });
}
