import type { Id } from "@convex/_generated/dataModel";
import { useSelectedNode } from "@editor/canvas";
import { setSelectedNode } from "@editor/canvas/stores/canvasStore";
import { useSelectedNodeData, useSelectedNodeTitle } from "@project/file-manager";
import { useCallback } from "react";

export function useNodeAttachment(projectId?: Id<"projects">, fileId?: Id<"files">) {
  const selectedNode = useSelectedNode(projectId, fileId);
  const selectedNodeData = useSelectedNodeData(projectId, fileId);
  const selectedNodeTitle = useSelectedNodeTitle(projectId, fileId);

  const handleDetachNode = useCallback(() => {
    if (projectId && fileId) {
      setSelectedNode(projectId, fileId, null);
    }
  }, [projectId, fileId]);

  return {
    selectedNode,
    selectedNodeData,
    selectedNodeCode: selectedNodeData?.code ?? null,
    selectedNodeTitle,
    handleDetachNode,
  };
}
