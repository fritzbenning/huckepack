import type { Id } from "@convex/_generated/dataModel";
import { useFileManagerStore } from "@project/file-manager";
import { useMemo } from "react";

export function usePresentNodes(projectId: Id<"projects">, fileId: Id<"files">): string[] {
  const layerTree = useFileManagerStore((state) => state.files[fileId]?.layerTree, projectId);

  return useMemo(() => {
    if (!layerTree?.flat) return [];
    return Object.keys(layerTree.flat);
  }, [layerTree]);
}

