"use client";

import { useElectron } from "@hooks/application/useElectron";
import type { TreeNode as TreeNodeType } from "@lib/parser/react/convertToTreeNode";
import type React from "react";
import { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { type FlatTreeItem, TreeItem } from "./TreeItem";

interface SortableTreeItem {
  id: string;
  node: TreeNodeType;
  depth: number;
  index: number;
}

interface VirtualizedTreeProps {
  flatTreeItems: FlatTreeItem[];
  selectedNode: string | null;
  expandedNodes: Set<string>;
  onNodeClick: (node: TreeNodeType) => void;
  onToggleExpanded: (nodePath: string, event: React.MouseEvent) => void;
  sortableItems?: SortableTreeItem[];
}

const TAB_HEIGHT = 56;
const ELECTRON_HEADER_HEIGHT = 38;
const PADDING = 24;

export const VirtualizedTree: React.FC<VirtualizedTreeProps> = ({
  flatTreeItems,
  selectedNode,
  expandedNodes,
  onNodeClick,
  onToggleExpanded,
  sortableItems,
}) => {
  const isElectron = useElectron();
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const calcContainerHeight = (newHeight: number) => {
    setContainerHeight(isElectron ? newHeight - ELECTRON_HEADER_HEIGHT - TAB_HEIGHT - PADDING : newHeight - TAB_HEIGHT - PADDING);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    calcContainerHeight(window.innerHeight);

    const handleResize = () => {
      calcContainerHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="py-3">
      <List
        height={containerHeight}
        width="100%"
        itemCount={flatTreeItems.length}
        itemSize={36}
        itemData={{
          items: flatTreeItems,
          selectedNode,
          expandedNodes,
          onNodeClick,
          onToggleExpanded,
          sortableItems,
        }}
        overscanCount={5}
        className="custom-scrollbar"
      >
        {TreeItem}
      </List>
    </div>
  );
};
