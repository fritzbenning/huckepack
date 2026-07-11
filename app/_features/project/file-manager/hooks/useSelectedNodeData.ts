import type { Id } from "@convex/_generated/dataModel";
import { useSelectedNode } from "@editor/canvas";
import type { FlatTreeNode } from "@editor/layer-tree";
import { useFileManagerStore } from "../stores/fileManagerStore";
import { normalizeProjectId } from "../utils/normalizeProjectId";

export function useSelectedNodeData(projectId?: Id<"projects">, fileId?: Id<"files">): FlatTreeNode | null {
  const selectedNode = useSelectedNode(projectId, fileId);

  const nodeData = useFileManagerStore((state) => {
    if (!fileId || !selectedNode) return null;
    const file = state.files[fileId];
    return file?.layerTree.flat[selectedNode] ?? null;
  }, normalizeProjectId(projectId));

  return nodeData;
}
