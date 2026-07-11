import { isJSXElement, isJSXExpressionContainer, isJSXFragment } from "@ast/type-check";
import type { JSXElementChild } from "@swc/wasm-web";

export type MoveDirection = "up" | "down";

export function findNextJSXSibling(children: JSXElementChild[], startIndex: number, direction: MoveDirection): number {
  if (direction === "up") {
    for (let i = startIndex - 1; i >= 0; i--) {
      const child = children[i];
      if (isJSXElement(child) || isJSXExpressionContainer(child) || isJSXFragment(child)) {
        return i;
      }
    }
  } else {
    for (let i = startIndex + 1; i < children.length; i++) {
      const child = children[i];
      if (isJSXElement(child) || isJSXExpressionContainer(child) || isJSXFragment(child)) {
        return i;
      }
    }
  }
  return -1;
}
