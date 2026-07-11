import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import type { LiteralType } from "@ast/types/literal";
import type { BooleanLiteral, NumericLiteral, StringLiteral } from "@swc/wasm-web";
import { createBooleanLiteral } from "./createBooleanLiteral";
import { createNumericLiteral } from "./createNumericLiteral";

export function createLiteral(
  value: string | number | boolean,
  literalType: LiteralType
): StringLiteral | NumericLiteral | BooleanLiteral {
  switch (literalType) {
    case "StringLiteral":
      return createStringLiteral(String(value));
    case "NumericLiteral":
      return createNumericLiteral(Number(value));
    case "BooleanLiteral":
      return createBooleanLiteral(Boolean(value));
    default:
      throw new Error(`Unsupported literal type: ${literalType}`);
  }
}
