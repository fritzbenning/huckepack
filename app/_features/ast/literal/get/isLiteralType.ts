import type { LiteralType } from "@ast/types/literal";

export function isLiteralType(type: string): type is LiteralType {
  return type === "StringLiteral" || type === "NumericLiteral" || type === "BooleanLiteral";
}
