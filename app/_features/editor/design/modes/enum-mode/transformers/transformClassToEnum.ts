import { normalizePrefix } from "@editor/design/shared/utils";
import { convertNumericValueToUnit } from "@editor/design/values/numeric/value/convertNumericValueToUnit";
import type { ArbitraryConfig } from "@editor/design/values/types";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";
import { extractNumericValue } from "../../../values/numeric/value/extractNumericValue";
import { getLinkedEnumValue } from "./getLinkedEnumValue";

interface TransformClassesToEnumParams {
  prefix: string;
  defaultUnit: Unit | null;
  currentEnumValue?: string | null;
  linkedValues: Map<string, unknown>;
  defaultEnumValue?: string;
  currentClass: string | null;
  classTokens: string[] | null;
  arbitraryConfig?: ArbitraryConfig | null;
}

function parseArbitraryValue(
  className: string,
  prefix: string,
  arbitraryConfig: { parse: (inner: string) => unknown | null } | undefined
): unknown | null {
  const normalizedPrefix = normalizePrefix(prefix);
  if (!className.startsWith(normalizedPrefix)) return null;

  const value = className.slice(normalizedPrefix.length);

  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1);
    if (arbitraryConfig) {
      return arbitraryConfig.parse(inner);
    }
    // Default parsing: try to parse as number
    const num = parseFloat(inner);
    return Number.isNaN(num) ? inner : num;
  }

  return null;
}

function findMatchingEnum(arbitraryValue: unknown, linkedValues: Map<string, unknown>): string | null {
  for (const [currentEnumValue, linkedValue] of linkedValues.entries()) {
    // Deep equality check for objects
    if (JSON.stringify(linkedValue) === JSON.stringify(arbitraryValue)) {
      return currentEnumValue;
    }
  }
  return null;
}

/**
 * Transforms numeric/arbitrary classes to enum classes.
 * Example: transformClassesToEnum({ prefix: "w", enumMap: ["auto", "full"], classtokes: ["w-[100px]"], linkedValues, ... })
 *   → { classesToRemove: ["w-[100px]"], classesToAdd: ["w-auto"] } (if linkedValue matches)
 */
export function transformClassToEnum({
  prefix,
  defaultUnit,
  linkedValues,
  defaultEnumValue,
  currentClass,
  classTokens,
  arbitraryConfig,
}: TransformClassesToEnumParams): string | null {
  let classToAdd: string | null = null;

  if (!classTokens) return null;
  if (!currentClass) return null;

  const { value: currentValue, unit: currentUnit } = extractNumericValue(currentClass, prefix);

  if (currentValue && currentUnit && defaultUnit) {
    const convertedValue = convertNumericValueToUnit(currentValue, currentUnit as Unit, defaultUnit);

    if (!convertedValue) return null;

    const targetEnum = getLinkedEnumValue(convertedValue, linkedValues as Map<string, number>) ?? null;

    if (targetEnum) {
      classToAdd = `${prefix}-${targetEnum}`;

      return classToAdd;
    }
  }

  if (arbitraryConfig) {
    // TODO: check this!
    const arbitraryValue = parseArbitraryValue(currentClass, prefix, arbitraryConfig);

    // TODO: check this!
    if (arbitraryValue !== null) {
      // Find matching enum by linkedValue
      // const matchingEnum = findMatchingEnum(arbitraryValue, linkedValues);
      // if (matchingEnum) {
      //   classToAdd = `${prefix}-${matchingEnum}`;
      //   return classToAdd;
      // }
    }
  }

  const targetEnum = defaultEnumValue;

  if (targetEnum) {
    classToAdd = `${prefix}-${targetEnum}`;
  }

  return classToAdd;
}
