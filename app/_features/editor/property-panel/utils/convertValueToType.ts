import type { LiteralType } from "@ast/types/literal";

export function convertValueToType(
  newValue: string | number | boolean,
  literalType: LiteralType
): string | number | boolean | null {
  if (literalType === "NumericLiteral" && typeof newValue === "string") {
    const numValue = Number(newValue);

    if (!Number.isNaN(numValue)) {
      return numValue;
    }
    console.error(`Invalid number value: ${newValue}`);
    return null;
  }

  if (literalType === "BooleanLiteral" && typeof newValue === "string") {
    return newValue === "true" || newValue === "1";
  }

  return newValue;
}
