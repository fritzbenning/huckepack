import { deriveCategories } from "@editor/design/shared/utils/category/deriveCategories";
import type { CategoryConfig, DesignCategory } from "@editor/design/ui/design-category/types";
import { DESIGN_PROPERTIES } from "./properties";

/**
 * List of all available design property categories in the framework.
 * Categories are used to group related design properties in the UI.
 *
 * @example
 * // Check if a category exists
 * const hasCategory = DESIGN_CATEGORIES.includes("Typography");
 *
 * @example
 * // Iterate through all categories
 * DESIGN_CATEGORIES.forEach(category => {
 *   console.log(`Category: ${category}`);
 * });
 */
export const DESIGN_CATEGORIES: DesignCategory[] = [
  "Position",
  "Dimensions",
  "Layout",
  "Spacing",
  "Background",
  "Stroke",
  "Appearance",
  "Typography",
  "Effects",
  "Animation",
] as const;

/**
 * Registry mapping categories to their associated design properties.
 * Automatically derived from DESIGN_PROPERTY_REGISTRY using deriveCategories.
 *
 * @example
 * // Find properties in the Typography category
 * const typographyConfig = DESIGN_CATEGORY_REGISTRY.find(c => c.category === "Typography");
 * console.log(typographyConfig?.properties); // ["fontFamily", "fontSize", "fontWeight", ...]
 *
 * @example
 * // Get all categories with their property counts
 * DESIGN_CATEGORY_REGISTRY.forEach(config => {
 *   console.log(`${config.category}: ${config.properties.length} properties`);
 * });
 */
export const DESIGN_CATEGORY_REGISTRY: CategoryConfig[] = deriveCategories(DESIGN_PROPERTIES);
