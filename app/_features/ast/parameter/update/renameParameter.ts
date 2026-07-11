import { traverseExports } from "@ast/utils";
import type { FunctionDeclaration, FunctionExpression, Module } from "@swc/wasm-web";
import { findParameterByName, getObjectPatternFromDeclaration } from "../utils";

// Renames a parameter in component props
export function renameParameter(ast: Module, oldParamName: string, newParamName: string): Module | null {
  const renameParameterInPattern = (pattern: ReturnType<typeof getObjectPatternFromDeclaration>): boolean => {
    const param = findParameterByName(pattern, oldParamName);

    if (param?.key && "value" in param.key) {
      param.key.value = newParamName;
      return true;
    }

    return false;
  };

  const { ast: transformedAst, found } = traverseExports(
    ast,
    (declaration: FunctionDeclaration | FunctionExpression) => {
      const pattern = getObjectPatternFromDeclaration(declaration);
      return renameParameterInPattern(pattern);
    }
  );

  return found ? transformedAst : null;
}
