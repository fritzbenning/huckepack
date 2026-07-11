import { traverseExports } from "@ast/utils";
import type { FunctionDeclaration, FunctionExpression, Identifier, Module } from "@swc/wasm-web";
import { findParameterByName, getObjectPatternFromDeclaration } from "../utils";

// Removes the default value from a parameter in component props
export function removeDefaultValue(ast: Module, _fileName: string, paramName: string): Module | null {
  const removeDefaultValueFromPattern = (pattern: ReturnType<typeof getObjectPatternFromDeclaration>): boolean => {
    const param = findParameterByName(pattern, paramName);

    if (param && param.value !== null && param.value !== undefined) {
      const keySpan = (param.key as Identifier).span;

      param.value = undefined as unknown as typeof param.value;

      param.span = {
        start: param.span.start,
        end: keySpan.end,
        ctxt: param.span.ctxt,
      };

      return true;
    }

    return false;
  };

  const { ast: transformedAst, found } = traverseExports(
    ast,
    (declaration: FunctionDeclaration | FunctionExpression) => {
      const pattern = getObjectPatternFromDeclaration(declaration);
      return removeDefaultValueFromPattern(pattern);
    }
  );

  return found ? transformedAst : null;
}
