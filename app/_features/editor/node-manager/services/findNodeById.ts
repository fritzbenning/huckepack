import { findJSXElementBySpan } from "@ast/jsx";
import { getFileSpanMap } from "@project/file-manager/stores/fileManagerStore";
import type { JSXElement, Module } from "@swc/wasm-web";

export function findJSXElementById(ast: Module, nodeId: string, projectId: string, fileId: string): JSXElement | null {
  if (!nodeId) return null;

  const spanMap = getFileSpanMap(fileId, projectId);

  // Find the span start position for this node ID
  for (const [spanStart, id] of spanMap.entries()) {
    if (id === nodeId) {
      return findJSXElementBySpan(ast, spanStart);
    }
  }

  return null;
}
