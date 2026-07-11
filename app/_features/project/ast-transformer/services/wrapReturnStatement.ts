import { createJSXElement, createJSXExpressionContainer } from "@ast/jsx";
import type { Expression, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";

export function wrapReturnStatement(ast: Module): void {
  let returnStatementWrapped = false;

  simple(ast, {
    ReturnStatement(node) {
      if (returnStatementWrapped || !node.argument) return;

      const jsxExpression = node.argument.type === "ParenthesisExpression" ? node.argument.expression : node.argument;
      const wrappedJSX = createJSXElement("PreviewWrapper", [
        createJSXExpressionContainer(jsxExpression as Expression),
      ]);

      node.argument = wrappedJSX as typeof node.argument;
      returnStatementWrapped = true;
    },
  });
}
