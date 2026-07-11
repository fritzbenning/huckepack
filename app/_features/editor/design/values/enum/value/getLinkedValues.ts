import type { EnumValueDef } from "../../types";

export function getLinkedValues(enumDefs: EnumValueDef[] | undefined): Map<string, unknown> {
  const linkedValues = new Map<string, unknown>();

  if (enumDefs) {
    for (const enumDef of enumDefs) {
      if (typeof enumDef === "string") {
        linkedValues.set(enumDef, null);
      } else {
        if (enumDef.linkedValue !== undefined) {
          linkedValues.set(enumDef.name, enumDef.linkedValue);
        } else {
          linkedValues.set(enumDef.name, null);
        }
      }
    }
  }

  return linkedValues;
}
