import type { EnumValueDef } from "@editor/design/values/types";
import type { SelectOption } from "@shared/ui-kit/ui/SelectList";

/**
 * Generates select options from an array of enum values.
 */
export function getSelectOptionsFromExtention(values: readonly EnumValueDef<unknown>[] | string[]): SelectOption[] {
  let enumValues: string[] = [];

  const optionValues = Object.values(values);

  if (typeof optionValues[0] === "string") {
    enumValues = optionValues as string[];

    return enumValues.map((value) => ({
      value,
      label: value,
    }));
  }

  const enumValuesWithLinkedValues = optionValues as { name: string }[];

  enumValues = enumValuesWithLinkedValues.map((value) => value.name);

  return enumValues.map((value) => ({
    value,
    label: value,
  }));
}
