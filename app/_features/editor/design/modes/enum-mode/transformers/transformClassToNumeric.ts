import { normalizePrefix } from "@editor/design/shared/utils";
import { extractEnumValue } from "@editor/design/values/enum/value/extractEnumValue";
import { createNumericClass } from "@editor/design/values/numeric/classes/create/createNumericClass";
import type { ArbitraryConfig } from "@editor/design/values/types";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";

interface TransformClassesToNumericParams {
  prefix: string;
  currentEnumValue?: string | null;
  linkedValues: Map<string, unknown>;
  currentClass: string | null;
  classTokens: string[] | null;
  numericTargetValue?: { value: number; unit: Unit };
  defaultUnit: Unit | null;
  arbitraryConfig?: ArbitraryConfig | null;
}

function formatArbitraryValue(
  value: unknown,
  arbitraryConfig: ArbitraryConfig | null | undefined,
  defaultUnit: Unit | null
): string {
  if (arbitraryConfig) {
    return arbitraryConfig.format(value);
  }

  // Default format: [value+unit] for numbers
  if (typeof value === "number" && defaultUnit) {
    return `[${value}${defaultUnit}]`;
  }

  // For complex objects, try to stringify
  if (value !== null && value !== undefined) {
    return `[${String(value)}]`;
  }

  return "[0]";
}

/**
 * Transforms enum classes to numeric/arbitrary classes.
 * Example: transformClassesToNumeric({ prefix: "w", enumMap: ["auto", "full"], classtokens: ["w-auto"], linkedValues, ... })
 *   → "w-[0px]" (if linkedValue exists)
 */
export function transformClassToNumeric({
  prefix,
  currentClass,
  linkedValues,
  classTokens,
  numericTargetValue,
  defaultUnit,
  arbitraryConfig,
}: TransformClassesToNumericParams): string | null {
  if (!classTokens) return null;
  if (!currentClass) return null;

  const exactPrefix = normalizePrefix(prefix);

  const currentEnumValue = currentClass ? extractEnumValue(currentClass, prefix) : null;
  const linkedValue = currentEnumValue ? linkedValues.get(currentEnumValue) : null;

  if (linkedValue != null) {
    if (arbitraryConfig) {
      // TODO: check this!
      const formattedArbitraryValue = formatArbitraryValue(linkedValue, arbitraryConfig, defaultUnit);
      return `${exactPrefix}${formattedArbitraryValue}`;
    }

    if (defaultUnit) {
      return `${exactPrefix}[${linkedValue}${defaultUnit}]`;
    }
  }

  if (numericTargetValue) {
    return createNumericClass(prefix, numericTargetValue.value, numericTargetValue.unit) ?? null;
  }

  return null;
}
