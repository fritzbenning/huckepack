import { traverseExports } from "@ast/utils";
import type { FunctionDeclaration, FunctionExpression, Module } from "@swc/wasm-web";
import { findParameterByName, getObjectPatternFromDeclaration } from "../utils";

// Removes a parameter from component props
export function removeParameter(ast: Module, fileName: string, paramName: string): Module | null {
  const removeParameterFromPattern = (pattern: ReturnType<typeof getObjectPatternFromDeclaration>): boolean => {
    if (!pattern?.properties) {
      return false;
    }

    const param = findParameterByName(pattern, paramName);
    if (!param) {
      return false;
    }

    const index = pattern.properties.indexOf(param);
    if (index !== -1) {
      pattern.properties.splice(index, 1);
      return true;
    }

    return false;
  };

  const { ast: transformedAst, found } = traverseExports(
    ast,
    (declaration: FunctionDeclaration | FunctionExpression) => {
      const pattern = getObjectPatternFromDeclaration(declaration);
      return removeParameterFromPattern(pattern);
    }
  );

  return found ? transformedAst : null;
}
