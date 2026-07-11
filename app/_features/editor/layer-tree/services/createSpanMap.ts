import type { HierarchicalTreeNode } from "../types";

export function createSpanMap(node: HierarchicalTreeNode): Map<number, string> {
  const spanMap = new Map<number, string>();

  const traverse = (node: HierarchicalTreeNode): void => {
    spanMap.set(node.info.span.start, node.id);
    for (const child of node.children) {
      traverse(child);
    }
  };

  traverse(node);

  return spanMap;
}
