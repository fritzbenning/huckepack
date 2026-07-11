import { getNestedJSXElements } from "@ast/jsx";
import { isJSXElement } from "@ast/type-check";
import type { JSXElementChild } from "@swc/wasm-web";

export function countJSXSiblings(children: JSXElementChild[], position: number): number {
  let count = 0;
  for (let i = 0; i < position; i++) {
    const child = children[i];
    if (isJSXElement(child)) {
      count++;
    } else {
      // Count nested JSX elements (from expression containers, fragments, etc.)
      const nestedElements = getNestedJSXElements(child);
      count += nestedElements.length;
    }
  }
  return count;
}

