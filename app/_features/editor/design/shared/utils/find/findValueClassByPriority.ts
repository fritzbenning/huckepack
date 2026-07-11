import { normalizePrefix } from "../normalize/normalizePrefix";

interface FindValueClassByPriorityParams {
  expandedClasses: string[];
  priority: string[];
}

/**
 * Finds a class from expanded classes based on priority order.
 * Used to determine which value to use when compressing individual classes to unified.
 *
 * @param params - Parameters object
 * @param params.expandedClasses - Array of expanded class names
 * @param params.priority - Array of prefixes in priority order
 * @returns Object with the found class and its prefix, or null if none found
 * @example
 * // Simple: Find class by priority
 * findValueClassByPriority({ expandedClasses: ["pt-4", "pr-4"], priority: ["px", "pt"] }); // { valueClass: "pt-4", valuePrefix: "pt" }
 *
 * @example
 * // Comprehensive: Priority ordering and fallback
 * findValueClassByPriority({ expandedClasses: ["pt-4", "pr-4"], priority: ["pr", "pt"] }); // { valueClass: "pr-4", valuePrefix: "pr" } - pr has priority
 * findValueClassByPriority({ expandedClasses: ["pt-4"], priority: ["pb", "pl"] }); // { valueClass: "pt-4", valuePrefix: "pt" } - fallback to first class
 * findValueClassByPriority({ expandedClasses: ["hover:pt-4"], priority: ["pt"] }); // { valueClass: "hover:pt-4", valuePrefix: "pt" } - handles variants
 * findValueClassByPriority({ expandedClasses: [], priority: ["pt"] }); // null - empty classes
 */
export function findValueClassByPriority({
  expandedClasses,
  priority,
}: FindValueClassByPriorityParams): { valueClass: string; valuePrefix: string } | null {
  let valueClass: string | null = null;
  let valuePrefix: string | null = null;

  for (const prefix of priority) {
    const found = expandedClasses.find((cls) => {
      const normalizedPrefix = normalizePrefix(prefix);
      // Handle variant prefixes (e.g., "md:px-4")
      const variantMatch = cls.match(/^([a-z@-]+:)?(.+)$/);
      if (variantMatch) {
        const base = variantMatch[2];
        return base.startsWith(normalizedPrefix) || base === prefix;
      }
      return cls.startsWith(normalizedPrefix) || cls === prefix;
    });
    if (found) {
      valueClass = found;
      valuePrefix = prefix;
      break;
    }
  }

  if (!valueClass && expandedClasses.length > 0) {
    valueClass = expandedClasses[0];
    // Handle variant prefixes (e.g., "md:px-4") and extract base prefix
    const variantMatch = valueClass.match(/^([a-z@-]+:)?([a-z]+)(?:-|$)/);
    valuePrefix = variantMatch ? variantMatch[2] : null;
  }

  if (valueClass && valuePrefix) {
    return { valueClass, valuePrefix };
  }

  return null;
}
