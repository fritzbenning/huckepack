import { CATEGORY_PATTERNS } from "../constants";
import { getTailwindBaseClass } from "./getTailwindBaseClass";

export function getTokenCategory(token: string): string {
  const baseClassName = getTailwindBaseClass(token);

  for (const { category, patterns } of CATEGORY_PATTERNS) {
    if (patterns.some((pattern) => pattern.test(baseClassName))) {
      return category;
    }
  }
  return "Uncategorized";
}
