import type { ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, Param } from "@swc/wasm-web";
import { addRestParamter } from "../add/addRestParamter";
import { createParameterWithRestElement } from "../create/createParameterWithRestElement";
import { getParameterPattern } from "../get/getParameterPattern";
import { getRestParameterName } from "../get/getRestParameterName";

export function ensureRestParameter(
  declaration: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression,
  propName: string = "restProps"
): boolean {
  // Check if rest parameter already exists
  if (getRestParameterName(declaration)) {
    return true;
  }

  // Ensure params array exists
  if (!declaration.params) {
    declaration.params = [];
  }

  // Cast params to Param[] for type compatibility across union types
  const params = declaration.params as Param[];

  // If no parameters exist, create a new parameter with ObjectPattern containing only RestElement
  if (params.length === 0) {
    const newParameter = createParameterWithRestElement(propName);
    params.push(newParameter);
    return true;
  }

  const firstParam = params[0];
  const pattern = getParameterPattern(firstParam);

  if (pattern) {
    addRestParamter(pattern, propName);
    return true;
  }

  return false;
}
