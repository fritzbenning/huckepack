import { useSelectedNode } from "@editor/canvas";
import { setSelectedNode } from "@editor/canvas/stores/canvasStore";
import { Activity, useMemo, useState } from "react";
import type { HierarchicalTreeNode } from "../types";
import { TreeItem } from "./TreeItem";

export function TreeGroup({
  node,
  projectId,
  fileId,
}: {
  node: HierarchicalTreeNode;
  projectId: string;
  fileId: string;
}) {
  const selectedNode = useSelectedNode(projectId, fileId);
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleGroup = () => {
    setIsExpanded(!isExpanded);
  };

  const isActive = useMemo(() => selectedNode === node.id, [selectedNode, node.id]);
  const isHidden = node.info.hidden;
  const shouldApplyOpacity = isHidden;

  return (
    <div
      className={`flex flex-col gap-1 rounded-md ${isActive && "bg-neutral-100/50 dark:bg-neutral-950/30"} ${shouldApplyOpacity && "opacity-50"}`}
      key={`tree-group-${node.id}`}
    >
      <TreeItem
        node={node}
        depth={node.info.depth}
        hasChildren={node.children.length > 0}
        isExpanded={isExpanded}
        isActive={isActive}
        onClick={() => setSelectedNode(projectId, fileId, node.id)}
        onToggleExpand={toggleGroup}
        projectId={projectId}
        fileId={fileId}
      />
      {node.children.length > 0 && (
        <Activity mode={isExpanded ? "visible" : "hidden"}>
          <div className="flex flex-col gap-1" key={`tree-group-children-${node.id}`}>
            {node.children.map((child) => (
              <TreeGroup node={child} projectId={projectId} fileId={fileId} key={`tree-group-${child.id}`} />
            ))}
          </div>
        </Activity>
      )}
    </div>
  );
}
