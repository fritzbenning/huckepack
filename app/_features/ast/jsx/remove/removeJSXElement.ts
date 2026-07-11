import { getSpan } from "@ast/core/get/getSpan";
import { isJSXElement, isJSXFragment, isParenthesisExpression } from "@ast/type-check";
import { transformASTOrNull } from "@ast/utils";
import type { JSXElement, JSXElementChild, Module, ReturnStatement } from "@swc/wasm-web";

// Removes an element and surrounding whitespace from a children array
function removeElementFromChildren(children: JSXElementChild[], index: number): void {
  const indicesToRemove: number[] = [];

  if (index > 0 && children[index - 1].type === "JSXText") {
    const prevText = children[index - 1] as { value: string };
    if (prevText.value.trim() === "") {
      indicesToRemove.push(index - 1);
    }
  }

  indicesToRemove.push(index);

  if (index + 1 < children.length && children[index + 1].type === "JSXText") {
    const nextText = children[index + 1] as { value: string };
    if (nextText.value.trim() === "") {
      indicesToRemove.push(index + 1);
    }
  }

  indicesToRemove.sort((a, b) => b - a);
  for (const idx of indicesToRemove) {
    children.splice(idx, 1);
  }
}

// Removes a JSX element from the AST
export function removeJSXElement(ast: Module, nodeToDelete: JSXElement): Module | null {
  const nodeSpanStart = getSpan(nodeToDelete).start;

  return transformASTOrNull(ast, {
    JSXElement(node: unknown) {
      const jsxNode = node as JSXElement;

      for (let i = 0; i < jsxNode.children.length; i++) {
        const child = jsxNode.children[i];
        if (isJSXElement(child)) {
          const childSpan = getSpan(child);
          if (childSpan.start === nodeSpanStart) {
            removeElementFromChildren(jsxNode.children, i);
            return true;
          }
        }
      }
      return false;
    },
    ReturnStatement(node: unknown) {
      const returnNode = node as ReturnStatement;

      if (!returnNode.argument) return false;

      let currentExpression = returnNode.argument;

      if (isParenthesisExpression(currentExpression)) {
        currentExpression = currentExpression.expression;
      }

      if (isJSXFragment(currentExpression)) {
        for (let i = 0; i < currentExpression.children.length; i++) {
          const child = currentExpression.children[i];
          if (isJSXElement(child)) {
            const childSpan = getSpan(child);
            if (childSpan.start === nodeSpanStart) {
              removeElementFromChildren(currentExpression.children, i);
              return true;
            }
          }
        }
      }

      if (isJSXElement(currentExpression)) {
        const elementSpan = getSpan(currentExpression);
        if (elementSpan.start === nodeSpanStart) {
          return false;
        }
      }
      return false;
    },
  });
}
