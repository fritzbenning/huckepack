import type { Id } from "@convex/_generated/dataModel";
import type { HierarchicalTreeNode } from "@editor/layer-tree";
import { useFileManagerStore } from "../stores/fileManagerStore";
import { normalizeProjectId } from "../utils/normalizeProjectId";

export function useLayerTree(projectId?: Id<"projects">, fileId?: Id<"files">): HierarchicalTreeNode[] {
  return useFileManagerStore((state) => {
    if (!fileId) return [];
    const file = state.files[fileId];
    return file?.layerTree.hierarchical ?? [];
  }, normalizeProjectId(projectId));
}
