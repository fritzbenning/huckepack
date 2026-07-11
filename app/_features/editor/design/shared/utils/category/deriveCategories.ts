import { DESIGN_CATEGORIES } from "@editor/design/registry/categories";
import type { DesignPropertyRegistryEntry } from "@editor/design/registry/types";
import type { CategoryConfig, DesignCategory } from "@editor/design/ui/design-category/types";

/**
 * Derives category configurations from design property registry entries.
 * Groups properties by their category and returns them in the order defined by DESIGN_CATEGORIES.
 *
 * @param properties - Array of design property registry entries
 * @returns Array of category configurations with their associated rules
 * @example
 * // Simple: Derive categories from properties
 * const categories = deriveCategories(DESIGN_PROPERTY_REGISTRY);
 * // Returns: [{ name: "Position", rules: [...] }, { name: "Dimensions", rules: [...] }, ...]
 *
 * @example
 * // Comprehensive: Group properties and access by category
 * const properties = [
 *   { key: "width", category: "Dimensions", ... },
 *   { key: "height", category: "Dimensions", ... },
 *   { key: "position", category: "Position", ... }
 * ];
 * const categories = deriveCategories(properties);
 * const dimensionsCategory = categories.find(c => c.name === "Dimensions");
 * console.log(dimensionsCategory.rules.length); // 2
 */
export function deriveCategories(properties: DesignPropertyRegistryEntry[]): CategoryConfig[] {
  const categoryMap = new Map<DesignCategory, DesignPropertyRegistryEntry[]>();

  for (const rule of properties) {
    if (!rule.category) continue;

    if (!categoryMap.has(rule.category)) {
      categoryMap.set(rule.category, []);
    }
    categoryMap.get(rule.category)!.push(rule);
  }

  const categories: CategoryConfig[] = [];

  for (const categoryName of DESIGN_CATEGORIES) {
    const categoryRules = categoryMap.get(categoryName) ?? [];

    categories.push({
      name: categoryName,
      rules: categoryRules,
    });
  }

  return categories;
}
