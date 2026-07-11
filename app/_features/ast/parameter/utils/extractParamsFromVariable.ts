import { isCallExpression } from "@ast/type-check";
import type { FormattedParam } from "@project/ast-parser";
import type { FunctionExpression, Module } from "@swc/wasm-web";
import { extractFunctionFromForwardRef } from "./extractFunctionFromForwardRef";
import { extractParamsFromFunction } from "./extractParamsFromFunction";
import { findVariableDeclaration } from "./findVariableDeclaration";

export function extractParamsFromVariable(ast: Module, variableName: string): Record<string, FormattedParam> {
  const declarator = findVariableDeclaration(ast, variableName);
  if (!declarator || !declarator.init) {
    return {};
  }

  const init = declarator.init;

  if (isCallExpression(init)) {
    const forwardRefFunction = extractFunctionFromForwardRef(init);
    if (forwardRefFunction && "params" in forwardRefFunction) {
      return extractParamsFromFunction(forwardRefFunction);
    }
  }

  if (init.type === "FunctionExpression" || init.type === "ArrowFunctionExpression") {
    if ("params" in init) {
      return extractParamsFromFunction(init as FunctionExpression);
    }
  }

  return {};
}
