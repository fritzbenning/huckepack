import { useSelectedNode } from "@editor/canvas";
import { useFileManagerStore } from "@project/file-manager";
import { useMemo } from "react";

export function useInstanceCheck(projectId: string, fileId: string): boolean {
  const selectedNode = useSelectedNode(projectId, fileId);
  const layerTree = useFileManagerStore((state) => state.files[fileId]?.layerTree, projectId);

  return useMemo(() => {
    if (!selectedNode || !layerTree) return false;
    const nodeData = layerTree.flat[selectedNode];
    return nodeData?.isComponent ?? false;
  }, [selectedNode, layerTree]);
}
