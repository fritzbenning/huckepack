import { UNIT_REGISTRY } from "@editor/design/registry/units";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";

/**
 * Converts a numeric value from one unit to another.
 * Uses pixel as intermediate unit for conversion calculations.
 *
 * @param value - The numeric value to convert
 * @param fromUnit - Source unit (scale, px, rem, em, %, vw, vh)
 * @param toUnit - Target unit (scale, px, rem, em, %, vw, vh)
 * @returns Converted value in the target unit
 * @example
 * convertNumericValueToUnit(16, "px", "rem") // Returns 1
 * convertNumericValueToUnit(2, "rem", "px") // Returns 32
 * convertNumericValueToUnit(4, "scale", "px") // Returns 16
 */
export function convertNumericValueToUnit(
  value: number | null,
  fromUnit: Unit | null,
  toUnit: Unit | null
): number | null {
  if (!value || !fromUnit || !toUnit) return null;

  if (fromUnit === toUnit) {
    return value;
  }

  const valueInPx = UNIT_REGISTRY[fromUnit].toPx(value);

  return UNIT_REGISTRY[toUnit].fromPx(valueInPx);
}
