"use client";

import { TreeNode } from "@shared/ui-kit/editor/tree/TreeNode";
import type { TreeNode as TreeNodeType } from "@lib/parser/react/convertToTreeNode";
import type React from "react";

export interface FlatTreeItem {
  node: TreeNodeType;
  depth: number;
  index: number;
}

interface SortableTreeItem {
  id: string;
  node: TreeNodeType;
  depth: number;
  index: number;
}

export interface TreeItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: FlatTreeItem[];
    selectedNode: string | null;
    expandedNodes: Set<string>;
    onNodeClick: (node: TreeNodeType) => void;
    onToggleExpanded: (nodePath: string, event: React.MouseEvent) => void;
    sortableItems?: SortableTreeItem[];
  };
}

export const TreeItem: React.FC<TreeItemProps> = ({ index, style, data }) => {
  const { items, selectedNode, expandedNodes, onNodeClick, onToggleExpanded, sortableItems } = data;
  const item = items[index];

  if (!item) return null;

  // Find the corresponding sortable item
  const sortableItem = sortableItems?.find((sortable) => sortable.node.path === item.node.path && sortable.index === index);

  return (
    <div style={style} className="px-3">
      <TreeNode
        node={item.node}
        depth={item.depth}
        selectedNode={selectedNode}
        expandedNodes={expandedNodes}
        onNodeClick={onNodeClick}
        onToggleExpanded={onToggleExpanded}
        sortableId={sortableItem?.id}
      />
    </div>
  );
};
