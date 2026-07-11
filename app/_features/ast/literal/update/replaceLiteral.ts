import { transformAST } from "@ast/utils";
import type { BooleanLiteral, Module, NumericLiteral, StringLiteral } from "@swc/wasm-web";

// Replaces a literal value at the given span start
export function replaceLiteral(
  ast: Module,
  start: number,
  newValue: string | number | boolean,
  type: "StringLiteral" | "NumericLiteral" | "BooleanLiteral"
): Module {
  const { ast: transformedAst, found } = transformAST(ast, {
    StringLiteral(node: StringLiteral) {
      if (node.span.start === start && type === "StringLiteral") {
        node.value = String(newValue);
        node.raw = `"${newValue}"`;
        return true;
      }
      return false;
    },
    NumericLiteral(node: NumericLiteral) {
      if (node.span.start === start && type === "NumericLiteral") {
        node.value = Number(newValue);
        node.raw = String(newValue);
        return true;
      }
      return false;
    },
    BooleanLiteral(node: BooleanLiteral) {
      if (node.span.start === start && type === "BooleanLiteral") {
        if (typeof newValue === "boolean") {
          node.value = newValue;
        } else if (typeof newValue === "string") {
          node.value = newValue === "true" || newValue === "1";
        } else {
          node.value = newValue === 1;
        }
        return true;
      }
      return false;
    },
  });

  if (!found) {
    console.error(`Literal not found at start ${start} with type ${type}`);
  }

  return transformedAst;
}
