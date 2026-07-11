import { getSpan } from "@ast/core/get/getSpan";
import { getNestedJSXElements } from "@ast/jsx";
import { isJSXElement } from "@ast/type-check";
import type { JSXElement, JSXElementChild } from "@swc/wasm-web";

export function findSiblingIndexBySpan(parent: JSXElement, nodeSpanStart: number): number {
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];
    if (isJSXElement(child)) {
      const childSpan = getSpan(child);
      if (childSpan.start === nodeSpanStart) {
        return i;
      }
    }

    const nestedElements = getNestedJSXElements(child as JSXElementChild);
    for (const element of nestedElements) {
      const elementSpan = getSpan(element);
      if (elementSpan.start === nodeSpanStart) {
        return i;
      }
    }
  }
  return -1;
}

