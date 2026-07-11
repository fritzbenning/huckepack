import type { LiteralType } from "@ast/types/literal";

export function mapTypeToLiteralType(type: string): LiteralType {
  if (type === "number" || type === "NumericLiteral") {
    return "NumericLiteral";
  }
  if (type === "boolean" || type === "BooleanLiteral") {
    return "BooleanLiteral";
  }
  return "StringLiteral";
}
