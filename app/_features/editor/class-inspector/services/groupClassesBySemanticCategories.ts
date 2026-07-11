import { CATEGORY_PATTERNS } from "../constants";
import type { ClassSuggestionsByCategory, SemanticClassGroupsMap } from "../types";
import { getTailwindBaseClass } from "../utils/getTailwindBaseClass";

export function groupClassesBySemanticCategories(
  tokensOrSuggestions: string[]
): SemanticClassGroupsMap | ClassSuggestionsByCategory {
  if (tokensOrSuggestions.length === 0) {
    return {};
  }

  const isStringArray = typeof tokensOrSuggestions[0] === "string";
  if (isStringArray) {
    const tokens = tokensOrSuggestions as string[];
    const result: SemanticClassGroupsMap = {};
    const uncategorized: string[] = [];

    for (const token of tokens) {
      let found = false;
      const baseClassName = getTailwindBaseClass(token);

      for (const { category, patterns } of CATEGORY_PATTERNS) {
        if (patterns.some((pattern) => pattern.test(baseClassName))) {
          if (!result[category]) {
            result[category] = [];
          }
          result[category].push(token);
          found = true;
          break;
        }
      }

      if (!found) {
        uncategorized.push(token);
      }
    }

    if (uncategorized.length > 0) {
      result.Uncategorized = uncategorized;
    }

    return result;
  } else {
    const suggestions = tokensOrSuggestions as string[];
    const result: ClassSuggestionsByCategory = {};
    const uncategorized: string[] = [];

    for (const suggestion of suggestions) {
      let found = false;
      const baseClassName = getTailwindBaseClass(suggestion);

      for (const { category, patterns } of CATEGORY_PATTERNS) {
        if (patterns.some((pattern) => pattern.test(baseClassName))) {
          if (!result[category]) {
            result[category] = [];
          }
          result[category].push(suggestion);
          found = true;
          break;
        }
      }

      if (!found) {
        uncategorized.push(suggestion);
      }
    }

    if (uncategorized.length > 0) {
      result.Uncategorized = uncategorized;
    }

    return result;
  }
}
