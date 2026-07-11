import { cn } from "@lib/utils";
import { CaretRight, File } from "@phosphor-icons/react";
import type React from "react";

export interface CSSTreeNode {
  path: string;
  name: string;
  type: "blob" | "tree";
  children?: CSSTreeNode[];
  isCSS?: boolean;
}

interface CSSTreeItemProps {
  node: CSSTreeNode;
  depth: number;
  expandedNodes: Set<string>;
  selectedFile?: string;
  onToggleExpanded: (path: string) => void;
  onFileSelect: (path: string) => void;
}

export const CSSTreeItem: React.FC<CSSTreeItemProps> = ({
  node,
  depth,
  expandedNodes,
  selectedFile,
  onToggleExpanded,
  onFileSelect,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.path);
  const isSelected = selectedFile === node.path;

  return (
    <div>
      <div
        className="flex items-center rounded-md px-2 py-1.5 text-xs transition-colors"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {hasChildren && (
          <button
            type="button"
            onClick={() => onToggleExpanded(node.path)}
            className="mr-1.5 flex h-4 w-4 items-center justify-center rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-600"
          >
            <CaretRight
              className={cn(
                "h-3 w-3 text-neutral-500 transition-transform dark:text-neutral-400",
                isExpanded && "rotate-90"
              )}
              weight="duotone"
            />
          </button>
        )}
        <button
          type="button"
          onClick={() => node.isCSS && onFileSelect(node.path)}
          disabled={!node.isCSS}
          className={cn(
            "flex flex-1 items-center rounded-sm transition-colors",
            node.isCSS ? "" : "cursor-default text-neutral-500 dark:text-neutral-400",
            isSelected
              ? "bg-primary-500 text-white"
              : node.isCSS
                ? "hover:bg-neutral-100 dark:hover:bg-neutral-750"
                : ""
          )}
        >
          <div className="mr-2 flex h-4 w-4 items-center justify-center">
            <File className="size-3" weight="duotone" />
          </div>
          <span className="flex-1 truncate text-left leading-tight">{node.name}</span>
        </button>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {node.children?.map((child) => (
            <CSSTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              selectedFile={selectedFile}
              onToggleExpanded={onToggleExpanded}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
