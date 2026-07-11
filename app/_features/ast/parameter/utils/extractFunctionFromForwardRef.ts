import { isCallExpression, isIdentifier, isMemberExpression } from "@ast/type-check";
import type {
  CallExpression,
  FunctionExpression,
  Identifier,
  MemberExpression,
} from "@swc/wasm-web";

export function extractFunctionFromForwardRef(
  node: unknown
): FunctionExpression | undefined {
  if (!isCallExpression(node)) {
    return undefined;
  }

  const callExpr = node as CallExpression;
  const callee = callExpr.callee;

  // Check if callee is "forwardRef" (Identifier)
  if (isIdentifier(callee)) {
    const identifier = callee as Identifier;
    if (identifier.value === "forwardRef") {
      // Extract the function from the first argument
      const firstArg = callExpr.arguments?.[0];
      if (firstArg && typeof firstArg === "object" && "expression" in firstArg) {
        const expr = firstArg.expression;
        if (
          expr &&
          typeof expr === "object" &&
          (expr.type === "ArrowFunctionExpression" || expr.type === "FunctionExpression")
        ) {
          return expr as FunctionExpression;
        }
      }
    }
  }

  // Check if callee is "React.forwardRef" (MemberExpression)
  if (isMemberExpression(callee)) {
    const memberExpr = callee as MemberExpression;
    if (
      memberExpr.object &&
      isIdentifier(memberExpr.object) &&
      memberExpr.property &&
      isIdentifier(memberExpr.property)
    ) {
      const objectId = memberExpr.object as Identifier;
      const propertyId = memberExpr.property as Identifier;
      if (objectId.value === "React" && propertyId.value === "forwardRef") {
        // Extract the function from the first argument
        const firstArg = callExpr.arguments?.[0];
        if (firstArg && typeof firstArg === "object" && "expression" in firstArg) {
          const expr = firstArg.expression;
          if (
            expr &&
            typeof expr === "object" &&
            (expr.type === "ArrowFunctionExpression" || expr.type === "FunctionExpression")
          ) {
            return expr as FunctionExpression;
          }
        }
      }
    }
  }

  return undefined;
}

