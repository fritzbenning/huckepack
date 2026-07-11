import { useActiveProjectStore } from "@stores/activeProjectStore";
import { useState } from "react";
import { FolderItem, type TreeNode } from "./FolderItem";

export function FolderTree() {
  const componentFolders = useActiveProjectStore((state) => state.componentFolders);
  const rootComponentFolder = useActiveProjectStore((state) => state.rootComponentFolder);
  const currentComponentFolder = useActiveProjectStore((state) => state.currentComponentFolder);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Build the tree structure
  const buildTree = (): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // Helper function to strip root folder from path
    const stripRootFolder = (path: string): string => {
      if (!rootComponentFolder || !path.startsWith(rootComponentFolder)) return path;
      const stripped = path.slice(rootComponentFolder.length);
      return stripped.startsWith("/") ? stripped.slice(1) : stripped;
    };

    // Create nodes for all folders
    componentFolders.forEach((folderPath) => {
      const relativePath = stripRootFolder(folderPath);
      if (!relativePath) return; // Skip root folder itself

      const parts = relativePath.split("/").filter(Boolean);
      let currentPath = "";

      parts.forEach((part, index) => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!nodeMap.has(currentPath)) {
          const node: TreeNode = {
            name: part,
            path: currentPath,
            children: [],
            isExpanded: expandedFolders.has(currentPath),
          };

          nodeMap.set(currentPath, node);

          if (parentPath && nodeMap.has(parentPath)) {
            nodeMap.get(parentPath)?.children.push(node);
          } else if (index === 0) {
            rootNodes.push(node);
          }
        }
      });
    });

    return rootNodes;
  };

  const handleToggle = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const treeNodes = buildTree();

  if (treeNodes.length === 0) {
    return <div className="px-2 text-sm text-neutral-500 dark:text-neutral-400">No folders found</div>;
  }

  // Create a dummy node for "All Components"
  const allComponentsNode: TreeNode = {
    name: "All components",
    path: "",
    children: [],
    isExpanded: false,
  };

  return (
    <div className="space-y-1">
      <FolderItem
        node={allComponentsNode}
        onToggle={handleToggle}
        selectedFolder={currentComponentFolder}
        isAllComponents={true}
      />
      <div className="w-full px-3">
        <div className="my-3 border-neutral-200 border-b dark:border-neutral-750" />
      </div>
      {treeNodes.map((node) => (
        <FolderItem key={node.path} node={node} onToggle={handleToggle} selectedFolder={currentComponentFolder} />
      ))}
    </div>
  );
}
