import {
  isArrayExpression,
  isBlockStatement,
  isCallExpression,
  isJSXElement,
  isJSXFragment,
  isParenthesisExpression,
} from "@ast/type-check";
import type { JSXElement } from "@swc/wasm-web";
import { getJSXElementsFromChild } from "./getJSXElementsFromChild";

export function getJSXElementFromExpression(expr: unknown): JSXElement[] {
  if (!expr || typeof expr !== "object") return [];

  if (isJSXElement(expr)) {
    return [expr];
  }

  if (isJSXFragment(expr)) {
    const elements: JSXElement[] = [];
    if (expr.children) {
      for (const child of expr.children) {
        const childElements = getJSXElementsFromChild(child);
        elements.push(...childElements);
      }
    }
    return elements;
  }

  // Handle parenthesized expressions
  if (isParenthesisExpression(expr)) {
    return getJSXElementFromExpression(expr.expression);
  }

  // Handle array expressions: [<A />, <B />]
  if (isArrayExpression(expr)) {
    const elements: JSXElement[] = [];
    if (expr.elements) {
      for (const element of expr.elements) {
        if (element && typeof element === "object") {
          const elementExpr = (element as { expression?: unknown }).expression;
          if (elementExpr) {
            elements.push(...getJSXElementFromExpression(elementExpr));
          }
        }
      }
    }
    return elements;
  }

  // Handle call expressions: items.map(() => <Item />)
  if (isCallExpression(expr)) {
    const elements: JSXElement[] = [];
    if (expr.arguments) {
      for (const arg of expr.arguments) {
        if (arg && typeof arg === "object") {
          const argExpr = (arg as { expression?: unknown }).expression;
          if (argExpr && typeof argExpr === "object") {
            const exprType = (argExpr as { type?: string }).type;
            // Arrow function or function expression
            if (exprType === "ArrowFunctionExpression" || exprType === "FunctionExpression") {
              const body = (argExpr as { body?: unknown }).body;
              if (body) {
                elements.push(...getJSXElementFromExpression(body));
              }
            }
          }
        }
      }
    }
    return elements;
  }

  // Handle arrow function bodies
  if (isBlockStatement(expr)) {
    if (expr.stmts) {
      // Look for return statements in block
      for (const statement of expr.stmts) {
        if (statement && typeof statement === "object") {
          const stmt = statement as { type?: string; argument?: unknown };
          if (stmt.type === "ReturnStatement" && stmt.argument) {
            return getJSXElementFromExpression(stmt.argument);
          }
        }
      }
    }
  }

  return [];
}
