import type { SelectOption } from "@shared/ui-kit/ui/SelectList";
import { extractEnumValue } from "./extractEnumValue";

export function getSelectOptionsFromClasses(classTokens: readonly string[], prefix?: string): SelectOption[] {
  return classTokens.map((className) => {
    const enumValue = extractEnumValue(className, prefix || "") || className;

    return {
      value: enumValue,
      label: enumValue,
    };
  });
}
