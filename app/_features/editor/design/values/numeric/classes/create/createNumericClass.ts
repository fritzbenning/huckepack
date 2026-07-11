import type { ClassNormalizer } from "@editor/design/shared/helpers/normalizer/types";
import { roundToQuarterStep } from "@editor/design/shared/utils/value/math/roundToQuarterStep";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";
import { normalizePrefix } from "../../../../shared/utils/normalize";

/**
 * Format a numeric value and unit to a Tailwind class
 * - Scale unit: property-4 (numeric scale)
 * - Other units: property-[16px] (arbitrary value)
 * - With normalizer: Uses intelligent class generation (fractions, screen, etc.)
 */
export function createNumericClass(
  prefix: string,
  value: number | null,
  unit: Unit | null,
  normalizer?: ClassNormalizer
): string | null {
  if (value == null || !unit) return null;

  const normalizedPrefix = normalizePrefix(prefix);

  // Use normalizer if provided (handles fractions, screen, etc.)
  if (normalizer) {
    return normalizer.normalize(value, unit);
  }

  // Fallback to standard logic
  // Scale unit uses numeric format: property-4
  if (unit === "scale") {
    const roundedValue = roundToQuarterStep(value);
    return `${normalizedPrefix}${roundedValue}`;
  }

  // Other units use arbitrary value format: property-[valueunit]
  return `${normalizedPrefix}[${value}${unit}]`;
}
