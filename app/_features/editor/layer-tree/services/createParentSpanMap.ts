import type { HierarchicalTreeNode } from "../types";

export function createParentSpanMap(node: HierarchicalTreeNode): Map<number, number> {
  const parentSpanMap = new Map<number, number>();

  const traverse = (node: HierarchicalTreeNode, parentSpan?: number): void => {
    if (parentSpan !== undefined) {
      parentSpanMap.set(node.info.span.start, parentSpan);
    }
    for (const child of node.children) {
      traverse(child, node.info.span.start);
    }
  };

  traverse(node);

  return parentSpanMap;
}
