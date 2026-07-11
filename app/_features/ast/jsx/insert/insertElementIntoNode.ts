import { getSpan } from "@ast/core/get/getSpan";
import { createTransformedAST } from "@ast/utils";
import type { JSXElement, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { createJSXText } from "../create/createJSXText";

export function insertElementIntoNode(ast: Module, parentNode: JSXElement, newElement: JSXElement): Module {
  const transformedAst = createTransformedAST(ast);
  const parentSpanStart = getSpan(parentNode).start;

  simple(transformedAst, {
    JSXElement(node) {
      const span = getSpan(node);
      if (span.start === parentSpanStart) {
        // Add whitespace before the new element if there are existing children
        if (node.children.length > 0) {
          const lastChild = node.children[node.children.length - 1];
          // Only add whitespace if the last child is not already whitespace
          if (lastChild.type !== "JSXText" || lastChild.value.trim() !== "") {
            node.children.push(createJSXText("\n      "));
          }
        } else {
          // Add initial whitespace if no children exist
          node.children.push(createJSXText("\n      "));
        }

        // Add the new element
        node.children.push(newElement as unknown as (typeof node.children)[0]);

        // Add trailing whitespace
        node.children.push(createJSXText("\n    "));
      }
    },
  });

  return transformedAst;
}
