import { updateInterfacePropertyType } from "@ast/interface";
import { traverseExports } from "@ast/utils";
import type { FunctionDeclaration, FunctionExpression, Module } from "@swc/wasm-web";
import { findParameterByName, getObjectPatternFromDeclaration } from "../utils";

// Updates the type of a parameter in component props
export function updateParameterType(
  ast: Module,
  paramName: string,
  newType: string,
  unionOptions?: (string | number | boolean)[]
): Module | null {
  const checkParameterExists = (pattern: ReturnType<typeof getObjectPatternFromDeclaration>): boolean => {
    const param = findParameterByName(pattern, paramName);
    return param !== undefined;
  };

  const { ast: transformedAst, found } = traverseExports(
    ast,
    (declaration: FunctionDeclaration | FunctionExpression) => {
      const pattern = getObjectPatternFromDeclaration(declaration);
      return checkParameterExists(pattern);
    }
  );

  if (found) {
    return updateInterfacePropertyType(transformedAst, paramName, newType, unionOptions);
  }

  return null;
}
