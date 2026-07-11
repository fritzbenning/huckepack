import { getSpan } from "@ast/core/get/getSpan";
import { isJSXElement } from "@ast/type-check";
import type { JSXElement, JSXFragment } from "@swc/wasm-web";

export type MoveDirection = "up" | "down";

export function moveJSXElementInFragment(
  fragment: JSXFragment,
  nodeSpanStart: number,
  direction: MoveDirection
): boolean {
  // Get all JSX element children with their original indices
  const jsxChildren: { element: JSXElement; originalIndex: number }[] = [];
  for (let i = 0; i < fragment.children.length; i++) {
    const child = fragment.children[i];
    if (isJSXElement(child)) {
      jsxChildren.push({ element: child, originalIndex: i });
    }
  }

  // Find the index of the node to move
  const nodeIndex = jsxChildren.findIndex(({ element }) => {
    const elementSpan = getSpan(element);
    return elementSpan.start === nodeSpanStart;
  });

  if (nodeIndex === -1) {
    return false;
  }

  // Check boundary conditions
  if (direction === "up" && nodeIndex === 0) {
    return false;
  }
  if (direction === "down" && nodeIndex === jsxChildren.length - 1) {
    return false;
  }

  // Get target index
  const targetIndex = direction === "up" ? nodeIndex - 1 : nodeIndex + 1;
  const targetOriginalIndex = jsxChildren[targetIndex].originalIndex;
  const currentOriginalIndex = jsxChildren[nodeIndex].originalIndex;

  // Remove the element from current position
  const elementToMove = fragment.children.splice(currentOriginalIndex, 1)[0];

  // Calculate insert position (adjust if we removed before target)
  const insertPosition =
    targetOriginalIndex > currentOriginalIndex
      ? targetOriginalIndex - 1
      : targetOriginalIndex + (direction === "up" ? 0 : 1);

  // Insert the element at target position
  fragment.children.splice(insertPosition, 0, elementToMove);

  return true;
}
