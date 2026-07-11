import { getSpan } from "@ast/core/get/getSpan";
import { findSiblingIndexBySpan } from "@ast/jsx";
import type { JSXElement } from "@swc/wasm-web";
import { findNextJSXSibling, type MoveDirection } from "./findNextJSXSibling";

export type MoveResult = {
  moved: boolean;
  newSiblingIndex: number | null;
};

export function moveJSXElementInParent(
  parent: JSXElement,
  nodeSpanStart: number,
  parentSpanStart: number,
  currentSiblingIndex: number,
  direction: MoveDirection
): MoveResult {
  const span = getSpan(parent);
  if (span.start !== parentSpanStart) {
    return { moved: false, newSiblingIndex: null };
  }

  // Find the source index in children array
  const sourceIndex = findSiblingIndexBySpan(parent, nodeSpanStart);
  if (sourceIndex === -1) {
    return { moved: false, newSiblingIndex: null };
  }

  // Find the target sibling by searching from sourceIndex
  const targetIndex = findNextJSXSibling(parent.children, sourceIndex, direction);

  if (targetIndex === -1) {
    // No sibling found in this direction (already at boundary)
    return { moved: false, newSiblingIndex: null };
  }

  // Remove the element from source position
  const elementToMove = parent.children.splice(sourceIndex, 1)[0];

  // Calculate insert position
  const insertPosition = targetIndex;

  // Insert the element at target position
  parent.children.splice(insertPosition, 0, elementToMove);

  // Calculate new sibling index: simply increment or decrement
  const newSiblingIndex = direction === "up" ? currentSiblingIndex - 1 : currentSiblingIndex + 1;

  return { moved: true, newSiblingIndex };
}
