import { EyeClosedIcon, EyeIcon, LockSimpleIcon, LockSimpleOpenIcon } from "@phosphor-icons/react";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import type React from "react";
import { toggleNodeLock } from "../services/toggleNodeLock";
import { toggleNodeVisibility } from "../services/toggleNodeVisibility";
import type { HierarchicalTreeNode } from "../types";
import { getIcon } from "../utils/getIcon";
import { TreeItemChevron } from "./TreeItemChrevron";
import { TreeItemContainer } from "./TreeItemContainer";

interface TreeNodeProps {
  node: HierarchicalTreeNode;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isActive: boolean;
  onClick: () => void;
  onToggleExpand: () => void;
  projectId: string;
  fileId: string;
}

export const TreeItem: React.FC<TreeNodeProps> = ({
  node,
  depth,
  hasChildren,
  isExpanded,
  isActive,
  onClick,
  onToggleExpand,
  projectId,
  fileId,
}) => {
  const { title, titlePrefix, attribute, classes, isComponent, hidden, locked } = node.info;

  const Icon = getIcon(classes?.classTokens ?? [], attribute, isComponent);

  const handleToggleVisibility = async (event: React.MouseEvent) => {
    event.stopPropagation();
    await toggleNodeVisibility({
      classes,
      hidden,
      projectId,
      fileId,
    });
  };

  const handleNodeLock = async (event: React.MouseEvent) => {
    event.stopPropagation();
    await toggleNodeLock({
      classes,
      projectId,
      fileId,
    });
  };

  return (
    <TreeItemContainer isComponent={isComponent} isActive={isActive} hidden={hidden} onClick={onClick}>
      <div className="flex items-center gap-1.5" style={{ paddingLeft: depth * 18 }}>
        {hasChildren ? (
          <TreeItemChevron isExpanded={isExpanded} onClick={onToggleExpand} />
        ) : (
          <div className="h-3 w-3" />
        )}
        <Icon className="current-color size-3.5" weight="duotone" />
        <span className="flex h-4.5 items-center font-medium text-xs">
          {titlePrefix && `${titlePrefix} `}
          {title}
        </span>
      </div>

      <div className={`ml-auto items-center gap-2 ${locked ? "flex" : "hidden group-hover:flex"}`}>
        <InlineIconButton
          icon={hidden ? EyeClosedIcon : EyeIcon}
          isActive={false}
          onClick={handleToggleVisibility}
          title={hidden ? "Show element" : "Hide element"}
        />
        <InlineIconButton
          icon={locked ? LockSimpleIcon : LockSimpleOpenIcon}
          isActive={locked}
          onClick={handleNodeLock}
          title={locked ? "Unlock element" : "Lock element"}
        />
      </div>
    </TreeItemContainer>
  );
};
