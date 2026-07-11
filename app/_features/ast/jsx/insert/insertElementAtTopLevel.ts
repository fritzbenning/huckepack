import { getSpan } from "@ast/core/get/getSpan";
import { isParenthesisExpression } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type {
  Expression,
  JSXElement,
  JSXElementChild,
  Module,
  ParenthesisExpression,
  ReturnStatement,
} from "@swc/wasm-web";
import { simple } from "swc-walk";
import { createJSXExpressionContainer } from "../create/createJSXExpressionContainer";
import { createJSXFragment } from "../create/createJSXFragment";
import { createJSXText } from "../create/createJSXText";

export function insertElementAtTopLevel(ast: Module, returnStatement: ReturnStatement, newElement: JSXElement): Module {
  const transformedAst = createTransformedAST(ast);
  const returnSpanStart = getSpan(returnStatement).start;

  simple(transformedAst, {
    ReturnStatement(node) {
      const span = getSpan(node);
      if (span.start === returnSpanStart && node.argument) {
        let currentExpression = node.argument;

        // Unwrap ParenthesisExpression if present
        if (isParenthesisExpression(currentExpression)) {
          currentExpression = currentExpression.expression;
        }

        // Check if the current expression is a JSXElement
        if (currentExpression.type === "JSXElement") {
          // Wrap existing element and new element in a fragment
          const fragment = createJSXFragment([
            createJSXText("\n    "),
            currentExpression as JSXElementChild,
            createJSXText("\n    "),
            newElement,
            createJSXText("\n  "),
          ]);

          // Update the argument, preserving ParenthesisExpression wrapper if it existed
          if (isParenthesisExpression(node.argument)) {
            (node.argument as ParenthesisExpression).expression = fragment as Expression;
          } else {
            node.argument = fragment as typeof node.argument;
          }
        } else if (currentExpression.type === "JSXFragment") {
          // If already a fragment, just add the new element
          if (currentExpression.children.length > 0) {
            const lastChild = currentExpression.children[currentExpression.children.length - 1];
            if (lastChild.type !== "JSXText" || lastChild.value.trim() !== "") {
              currentExpression.children.push(createJSXText("\n    "));
            }
          } else {
            currentExpression.children.push(createJSXText("\n    "));
          }
          currentExpression.children.push(newElement as unknown as (typeof currentExpression.children)[0]);
          currentExpression.children.push(createJSXText("\n  "));
        } else {
          // For other expression types, wrap in fragment
          const fragment = createJSXFragment([
            createJSXText("\n    "),
            createJSXExpressionContainer(currentExpression as Expression),
            createJSXText("\n    "),
            newElement,
            createJSXText("\n  "),
          ]);

          // Update the argument, preserving ParenthesisExpression wrapper if it existed
          if (isParenthesisExpression(node.argument)) {
            (node.argument as ParenthesisExpression).expression = fragment as Expression;
          } else {
            node.argument = fragment as typeof node.argument;
          }
        }
      }
    },
  });

  return transformedAst;
}
