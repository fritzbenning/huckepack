import { normalizePrefix } from "@editor/design/shared/utils";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";

interface ExtractNumericValueResult {
  value: number | null;
  unit: Unit | null;
}

/**
 * Extracts numeric value and unit from a Tailwind class.
 * Handles:
 * - Arbitrary values: tracking-[2em] → value: 2, unit: "em"
 * - Scale values: tracking-2 → value: 2, unit: "scale"
 * Returns { value: null, unit: null } if no numeric value is found.
 */
export function extractNumericValue(className: string, prefix: string): ExtractNumericValueResult {
  if (!className) return { value: null, unit: null };

  const normalizedPrefix = normalizePrefix(prefix);

  if (!className.startsWith(normalizedPrefix)) return { value: null, unit: null };

  const suffix = className.slice(normalizedPrefix.length);

  // Handle arbitrary values: tracking-[2em]
  if (suffix.startsWith("[") && suffix.endsWith("]")) {
    const inner = suffix.slice(1, -1);

    // Try to match value with unit: 2em, 16px, etc.
    const unitMatch = inner.match(/^(-?\d+(?:\.\d+)?)(px|em|rem|%|vw|vh)$/);

    if (unitMatch) {
      return {
        value: Number(unitMatch[1]),
        unit: unitMatch[2] as Unit,
      };
    }

    return { value: null, unit: null };
  }

  // Handle scale values: padding-2
  const numericValue = Number(suffix);

  if (!Number.isNaN(numericValue) && !suffix.includes("/")) {
    return {
      value: numericValue,
      unit: "scale",
    };
  }

  return { value: null, unit: null };
}
