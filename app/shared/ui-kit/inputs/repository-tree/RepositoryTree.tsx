import type { TreeItem } from "@hooks/repo/useRepositoryTree";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { RepositoryTreeItem, type RepositoryTreeNode } from "./RepositoryTreeItem";

interface RepositoryTreeProps {
  items: TreeItem[];
  selectedFolders?: string[];
  onSelectedFoldersChange?: (folders: string[]) => void;
  onRootFolderChange?: (folder: string) => void;
  className?: string;
}

export const RepositoryTree: React.FC<RepositoryTreeProps> = ({
  items,
  selectedFolders = [],
  onSelectedFoldersChange,
  onRootFolderChange,
  className = "",
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const getParentPaths = useMemo(() => {
    return (path: string): string[] => {
      const parts = path.split("/");
      const parentPaths: string[] = [];

      for (let i = 1; i < parts.length; i++) {
        parentPaths.push(parts.slice(0, i).join("/"));
      }

      return parentPaths;
    };
  }, []);

  useEffect(() => {
    if (selectedFolders.length > 0) {
      const pathsToExpand = new Set<string>();

      for (const folderPath of selectedFolders) {
        // Add all parent paths that need to be expanded to show this folder
        const parentPaths = getParentPaths(folderPath);
        for (const parentPath of parentPaths) {
          pathsToExpand.add(parentPath);
        }
      }

      setExpandedNodes((prev) => new Set([...prev, ...pathsToExpand]));
    }
  }, [selectedFolders, getParentPaths]);

  const treeData = useMemo(() => {
    const nodeMap = new Map<string, RepositoryTreeNode>();
    const rootNodes: RepositoryTreeNode[] = [];

    items.forEach((item) => {
      const pathParts = item.path.split("/");
      const name = pathParts[pathParts.length - 1];

      if (pathParts.length === 1 && item.type === "blob") {
        return;
      }

      const node: RepositoryTreeNode = {
        path: item.path,
        name,
        type: item.type,
        children: [],
      };

      nodeMap.set(item.path, node);
    });

    items.forEach((item) => {
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
          let currentPath = "";
          for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            const prevPath = currentPath;
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            if (!nodeMap.has(currentPath)) {
              const parentNode: RepositoryTreeNode = {
                path: currentPath,
                name: part,
                type: "tree",
                children: [],
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

    const sortChildren = (nodes: RepositoryTreeNode[]): RepositoryTreeNode[] => {
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

  const findAllChildFolders = (node: RepositoryTreeNode): string[] => {
    const childPaths: string[] = [];

    if (node.children) {
      node.children.forEach((child) => {
        if (child.type === "tree") {
          childPaths.push(child.path);
          childPaths.push(...findAllChildFolders(child));
        }
      });
    }

    return childPaths;
  };

  const findNodeByPath = (nodes: RepositoryTreeNode[], targetPath: string): RepositoryTreeNode | null => {
    for (const node of nodes) {
      if (node.path === targetPath) {
        return node;
      }
      if (node.children) {
        const found = findNodeByPath(node.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  };

  const handleToggleSelected = (path: string, selected: boolean) => {
    if (!onSelectedFoldersChange) return;
    if (!onRootFolderChange) return;

    let newSelectedFolders: string[];

    if (selected) {
      const node = findNodeByPath(treeData, path);
      const childFolders = node ? findAllChildFolders(node) : [];
      newSelectedFolders = [...selectedFolders, path, ...childFolders];
    } else {
      const node = findNodeByPath(treeData, path);
      const childFolders = node ? findAllChildFolders(node) : [];
      const foldersToRemove = new Set([path, ...childFolders]);
      newSelectedFolders = selectedFolders.filter((folder) => !foldersToRemove.has(folder));
    }

    onSelectedFoldersChange(newSelectedFolders);
    onRootFolderChange(path);
  };

  const renderTree = (nodes: RepositoryTreeNode[], depth: number = 0): React.ReactNode => {
    return nodes.map((node) => (
      <div key={node.path}>
        <RepositoryTreeItem
          node={node}
          depth={depth}
          isExpanded={expandedNodes.has(node.path)}
          isSelected={selectedFolders.includes(node.path)}
          onToggleExpanded={handleToggleExpanded}
          onToggleSelected={handleToggleSelected}
        />
        {expandedNodes.has(node.path) && node.children && node.children.length > 0 && (
          <div>{renderTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className={`w-full ${className}`}>
      {treeData.length > 0 ? (
        <div className="space-y-0.5">{renderTree(treeData)}</div>
      ) : (
        <div className="p-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
          No repository data available
        </div>
      )}
    </div>
  );
};
