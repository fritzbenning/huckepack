import { getNestedJSXElements } from "@ast/jsx";
import { isJSXElement, isJSXFragment, isParenthesisExpression } from "@ast/type-check";
import { transformAST } from "@ast/utils";
import type { JSXElement, Module, ReturnStatement } from "@swc/wasm-web";
import { addPropsSpread } from "./addPropsSpread";
import { hasPropsSpread } from "./hasPropsSpread";

// Ensures that the root JSX element has a props spread attribute
export function ensurePropsSpread(ast: Module): Module {
  const { ast: transformedAst } = transformAST(ast, {
    ReturnStatement(returnNode: unknown) {
      const node = returnNode as ReturnStatement;
      if (!node?.argument) return false;

      let rootExpression = node.argument;

      if (isParenthesisExpression(rootExpression)) {
        rootExpression = rootExpression.expression;
      }

      const jsxElements: JSXElement[] = [];

      if (isJSXFragment(rootExpression)) {
        const fragment = rootExpression;
        for (const child of fragment.children) {
          jsxElements.push(...getNestedJSXElements(child));
        }
      } else if (isJSXElement(rootExpression)) {
        jsxElements.push(rootExpression);
      } else {
        return false;
      }

      if (jsxElements.length > 0) {
        const rootElement = jsxElements[0];
        if (!hasPropsSpread(rootElement.opening)) {
          addPropsSpread(rootElement.opening);
        }
      }
      return false;
    },
  });

  return transformedAst;
}
