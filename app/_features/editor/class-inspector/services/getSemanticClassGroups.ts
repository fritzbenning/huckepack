import { CATEGORY_PATTERNS } from "./../constants";
import type { SemanticClassGroup } from "./../types.d";
import { groupClassesBySemanticCategories } from "./groupClassesBySemanticCategories";

export function getSemanticClassGroups(tokens: string[]): SemanticClassGroup[] {
  const grouped = groupClassesBySemanticCategories(tokens);
  const categoryOrderMap = new Map(CATEGORY_PATTERNS.map(({ category, sortOrder }) => [category, sortOrder]));

  return Object.entries(grouped)
    .sort(([categoryA], [categoryB]) => {
      const orderA = categoryOrderMap.get(categoryA) ?? Number.MAX_VALUE;
      const orderB = categoryOrderMap.get(categoryB) ?? Number.MAX_VALUE;
      return orderA - orderB;
    })
    .map(([category, tokens]) => ({ category, tokens }));
}
