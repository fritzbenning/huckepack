"use client";

import { TreeNodeChevron } from "@shared/ui-kit/editor/tree/TreeNodeChevron";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeSlash, Lock, LockOpen } from "@phosphor-icons/react";
import { hideNode, lockNode } from "@lib/code-manipulation/actions";
import { isNodeHidden } from "@lib/code-manipulation/utils/isNodeHidden";
import { getLayerName } from "@lib/interface/getLayerName";
import { getLayerNamePrefix } from "@lib/interface/getLayerNamePrefix";
import { getNodeColors } from "@lib/interface/getNodeColors";
import { getNodeIcon } from "@lib/interface/getNodeIcon";
import type { TreeNode as TreeNodeType } from "@lib/parser/react/convertToTreeNode";
import { getInstanceMetaStore } from "@stores/instanceStoreManager";
import type React from "react";

interface TreeNodeProps {
  node: TreeNodeType;
  depth: number;
  selectedNode: string | null;
  expandedNodes: Set<string>;
  onNodeClick: (node: TreeNodeType) => void;
  onToggleExpanded: (nodePath: string, event: React.MouseEvent) => void;
  sortableId?: string;
  isDragOverlay?: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  depth,
  selectedNode,
  expandedNodes,
  onNodeClick,
  onToggleExpanded,
  sortableId,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const paddingLeft = depth * 18;

  const hiddenNodes = getInstanceMetaStore().getState().hiddenNodes || new Set();
  const lockedNodes = getInstanceMetaStore().getState().lockedNodes || new Set();

  const layerNamePrefix = getLayerNamePrefix(node.props?.className);
  const layerName = getLayerName(node.name);

  const isSelected = selectedNode === node.path;
  const isExpanded = expandedNodes.has(node.path);
  const isHidden = isNodeHidden(node) || hiddenNodes.has(node.path);
  const isLocked = lockedNodes.has(node.path);

  // Use sortable only if sortableId is provided
  const sortable = useSortable({
    id: sortableId || "",
    disabled: !sortableId,
  });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEyeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    hideNode(node);
  };

  const handleLockClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    lockNode(node);
  };

  const handleNodeClick = (_event: React.MouseEvent) => {
    // Only handle click if not dragging
    if (!isDragging) {
      onNodeClick(node);
    }
  };

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      className={`group relative flex w-full cursor-pointer items-center rounded-md py-2 pr-3 pl-2 text-xs ${getNodeColors(node, isSelected)} ${isHidden ? "opacity-50" : ""} ${isDragging ? "z-10 opacity-75 shadow-lg" : ""}`}
      {...attributes}
      {...listeners}
      onClick={handleNodeClick}
    >
      <div className="flex items-center gap-1.5" style={{ paddingLeft: paddingLeft }}>
        <div className="flex h-4 w-4 items-center justify-center">
          {hasChildren ? (
            <TreeNodeChevron isExpanded={isExpanded} isSelected={isSelected} onToggleExpanded={(e) => onToggleExpanded(node.path, e)} />
          ) : (
            <div className="h-3 w-3" />
          )}
        </div>
        {getNodeIcon(node)}
        <span className="flex h-4.5 items-center font-medium">
          {layerNamePrefix}
          {layerName}
        </span>
      </div>

      <div className={`ml-auto items-center gap-2 ${isLocked ? "flex" : "hidden group-hover:flex"}`}>
        <InlineIconButton
          icon={isHidden ? EyeSlash : Eye}
          isActive={false}
          onClick={handleEyeClick}
          title={isHidden ? "Show element" : "Hide element"}
          className={isLocked ? "hidden group-hover:block" : ""}
        />
        <InlineIconButton
          icon={isLocked ? Lock : LockOpen}
          isActive={isLocked}
          onClick={handleLockClick}
          title={isLocked ? "Unlock element" : "Lock element"}
        />
      </div>
    </button>
  );
};
