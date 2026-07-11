import type { FunctionDeclaration, FunctionExpression, ObjectPattern } from "@swc/wasm-web";

export function getObjectPatternFromDeclaration(
  declaration: FunctionDeclaration | FunctionExpression | undefined
): ObjectPattern | undefined {
  if (!declaration || !declaration.params || declaration.params.length === 0) {
    return undefined;
  }

  const firstParam = declaration.params[0];

  if (!firstParam) {
    return undefined;
  }

  // Match the exact logic from extractParamsFromFunction
  // Check if param.pat is an ObjectPattern (standard case)
  const paramAsAny = firstParam as { pat?: { type?: string } };
  if (paramAsAny.pat?.type === "ObjectPattern") {
    return paramAsAny.pat as ObjectPattern;
  }

  // Check if param itself is an ObjectPattern (some arrow function cases)
  const paramAsUnknown = firstParam as unknown as { type?: string };
  if (paramAsUnknown.type === "ObjectPattern") {
    return firstParam as unknown as ObjectPattern;
  }

  return undefined;
}
