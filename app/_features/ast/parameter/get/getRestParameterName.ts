import type { ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, Identifier, RestElement } from "@swc/wasm-web";

export function getRestParameterName(declaration: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression): string | null {
  if (!declaration.params || declaration.params.length === 0) {
    return null;
  }

  const firstParam = declaration.params[0];
  
  // For FunctionExpression: params are wrapped in Parameter objects with pat property
  // For ArrowFunctionExpression: params are directly the pattern (ObjectPattern)
  let pattern: { properties?: Array<{ type?: string }> } | undefined;

  if (firstParam && "pat" in firstParam && firstParam.pat?.type === "ObjectPattern") {
    pattern = firstParam.pat;
  } else if (
    firstParam &&
    typeof firstParam === "object" &&
    "type" in firstParam &&
    (firstParam as { type?: string }).type === "ObjectPattern"
  ) {
    pattern = firstParam as unknown as { properties?: Array<{ type?: string }> };
  }

  if (pattern?.properties) {
    // Find the last property which could be a RestElement
    for (let i = pattern.properties.length - 1; i >= 0; i--) {
      const prop = pattern.properties[i];
      if (prop.type === "RestElement") {
        const restElement = prop as RestElement;
        if (restElement.argument?.type === "Identifier") {
          return (restElement.argument as Identifier).value;
        }
      }
    }
  }

  return null;
}
