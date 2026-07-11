import type { TreeItem } from "@hooks/repo/useRepositoryTree";
import { cn } from "@lib/utils";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { CSSTreeItem, type CSSTreeNode } from "./CSSTreeItem";

const isCSSFile = (filename: string): boolean => {
  const cssExtensions = [".css", ".scss", ".sass", ".less", ".styl"];
  return cssExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
};

interface CSSFileTreeProps {
  items: TreeItem[];
  selectedFile?: string;
  onFileSelect: (filePath: string) => void;
  className?: string;
}

export const CSSFileTree: React.FC<CSSFileTreeProps> = ({ items, selectedFile, onFileSelect, className = "" }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const treeData = useMemo(() => {
    const nodeMap = new Map<string, CSSTreeNode>();
    const rootNodes: CSSTreeNode[] = [];

    // Filter items to only include CSS files and their parent directories
    const cssItems = items.filter((item) => {
      if (item.type === "blob" && isCSSFile(item.path)) {
        return true;
      }
      if (item.type === "tree") {
        // Include directories that contain CSS files
        return items.some(
          (subItem) => subItem.type === "blob" && isCSSFile(subItem.path) && subItem.path.startsWith(`${item.path}/`)
        );
      }
      return false;
    });

    cssItems.forEach((item) => {
      const pathParts = item.path.split("/");
      const name = pathParts[pathParts.length - 1];

      const node: CSSTreeNode = {
        path: item.path,
        name,
        type: item.type,
        children: [],
        isCSS: item.type === "blob" && isCSSFile(item.path),
      };

      nodeMap.set(item.path, node);
    });

    cssItems.forEach((item) => {
      const node = nodeMap.get(item.path);
      if (!node) return;

      const pathParts = item.path.split("/");

      if (pathParts.length === 1) {
        rootNodes.push(node);
      } else {
        const parentPath = pathParts.slice(0, -1).join("/");
        const parent = nodeMap.get(parentPath);

        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          // Create missing parent directories
          let currentPath = "";
          for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            const prevPath = currentPath;
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            if (!nodeMap.has(currentPath)) {
              const parentNode: CSSTreeNode = {
                path: currentPath,
                name: part,
                type: "tree",
                children: [],
                isCSS: false,
              };
              nodeMap.set(currentPath, parentNode);

              if (prevPath && nodeMap.has(prevPath)) {
                nodeMap.get(prevPath)?.children?.push(parentNode);
              } else if (!prevPath) {
                rootNodes.push(parentNode);
              }
            }
          }

          const parent = nodeMap.get(pathParts.slice(0, -1).join("/"));
          if (parent) {
            parent.children?.push(node);
          }
        }
      }
    });

    const sortChildren = (nodes: CSSTreeNode[]): CSSTreeNode[] => {
      return nodes
        .sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "tree" ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        })
        .map((node) => ({
          ...node,
          children: node.children ? sortChildren(node.children) : [],
        }));
    };

    return sortChildren(rootNodes);
  }, [items]);

  useEffect(() => {
    if (selectedFile) {
      const pathsToExpand = new Set<string>();
      const pathParts = selectedFile.split("/");

      for (let i = 1; i < pathParts.length; i++) {
        pathsToExpand.add(pathParts.slice(0, i).join("/"));
      }

      setExpandedNodes((prev) => new Set([...prev, ...pathsToExpand]));
    }
  }, [selectedFile]);

  const handleToggleExpanded = (path: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleFileSelect = (path: string) => {
    onFileSelect(path);
  };

  return (
    <div className={cn("w-full", className)}>
      {treeData.length > 0 ? (
        <div className="space-y-0.5">
          {treeData.map((node) => (
            <CSSTreeItem
              key={node.path}
              node={node}
              depth={0}
              expandedNodes={expandedNodes}
              selectedFile={selectedFile}
              onToggleExpanded={handleToggleExpanded}
              onFileSelect={handleFileSelect}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
          No CSS files found in repository
        </div>
      )}
    </div>
  );
};
