import type { FlatTreeNode, HierarchicalTreeNode } from "../types";

export const flattenTree = (node: HierarchicalTreeNode): Map<string, FlatTreeNode> => {
  const lookupTree = new Map<string, FlatTreeNode>();

  const flattenNode = (node: HierarchicalTreeNode): void => {
    lookupTree.set(node.id, { ...node.info });
    for (const child of node.children) {
      flattenNode(child);
    }
  };

  flattenNode(node);
  return lookupTree;
};
