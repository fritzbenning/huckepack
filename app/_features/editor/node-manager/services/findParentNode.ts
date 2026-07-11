import { getSpan } from "@ast/core/get/getSpan";
import { findJSXElementBySpan } from "@ast/jsx";
import { getFileParentSpanMap } from "@project/file-manager/stores/fileManagerStore";
import type { JSXElement, Module } from "@swc/wasm-web";

/**
 * Finds the parent JSX element of a given node.
 * Uses parentSpanMap created during parsing for efficient lookup.
 * Returns null if the node has no parent (top-level element).
 */
export function findParentNode(ast: Module, node: JSXElement, projectId: string, fileId: string): JSXElement | null {
  const nodeSpanStart = getSpan(node).start;
  const parentSpanMap = getFileParentSpanMap(fileId, projectId);
  const parentSpanStart = parentSpanMap.get(nodeSpanStart);

  if (parentSpanStart === undefined) {
    // Node has no parent (top-level element)
    return null;
  }

  // Find the parent element by its span
  return findJSXElementBySpan(ast, parentSpanStart);
}
