import { getSpan } from "@ast/core/get/getSpan";
import type { JSXElement, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";

export function findJSXElementBySpan(ast: Module, spanStart: number): JSXElement | null {
  let foundElement: JSXElement | null = null;

  simple(ast, {
    JSXElement(node) {
      if (foundElement) return;
      const span = getSpan(node);
      if (span.start === spanStart) {
        foundElement = node as JSXElement;
      }
    },
  });

  return foundElement;
}
