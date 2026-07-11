import { cn } from "@lib/utils";
import { CaretRight, File, Folder } from "@phosphor-icons/react";
import type React from "react";
import { Checkbox } from "../checkbox/Checkbox";

export interface RepositoryTreeNode {
  path: string;
  name: string;
  type: "blob" | "tree";
  children?: RepositoryTreeNode[];
  depth?: number;
}

interface RepositoryTreeItemProps {
  node: RepositoryTreeNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpanded: (path: string) => void;
  onToggleSelected: (path: string, selected: boolean) => void;
}

export const RepositoryTreeItem: React.FC<RepositoryTreeItemProps> = ({
  node,
  depth,
  isExpanded,
  isSelected,
  onToggleExpanded,
  onToggleSelected,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isFolder = node.type === "tree";

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpanded(node.path);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    onToggleSelected(node.path, checked);
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex items-center rounded-md px-2 py-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-750",
          "text-xs text-neutral-750 dark:text-neutral-300"
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {hasChildren && (
          <div className="mr-1.5 flex h-4 w-4 items-center justify-center">
            <button
              type="button"
              onClick={handleChevronClick}
              className="flex h-4 w-4 items-center justify-center rounded-sm transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-750"
            >
              <CaretRight
                className={cn(
                  "h-3 w-3 text-neutral-500 transition-transform dark:text-neutral-400",
                  isExpanded && "rotate-90"
                )}
                weight="duotone"
              />
            </button>
          </div>
        )}
        {isFolder && (
          <div className="mr-2">
            <Checkbox checked={isSelected} onChange={handleCheckboxChange} size="small" />
          </div>
        )}
        <div className="mr-2 flex h-4 w-4 items-center justify-center">
          {isFolder ? (
            <Folder className="h-3 w-3 text-neutral-500 dark:text-neutral-400" weight="duotone" />
          ) : (
            <File className="h-3 w-3 text-neutral-500 dark:text-neutral-400" weight="duotone" />
          )}
        </div>
        <span className="flex-1 truncate text-left leading-tight">{node.name}</span>
      </div>
    </div>
  );
};
