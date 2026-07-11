import type { HierarchicalTreeNode } from "../types";

export function createComponentMap(node: HierarchicalTreeNode): Map<number, boolean> {
  const componentMap = new Map<number, boolean>();

  const traverse = (node: HierarchicalTreeNode): void => {
    // Use isComponent from the tree node info
    componentMap.set(node.info.span.start, node.info.isComponent);

    for (const child of node.children) {
      traverse(child);
    }
  };

  traverse(node);

  return componentMap;
}
