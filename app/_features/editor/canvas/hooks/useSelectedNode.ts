import { useCanvasStore } from "../stores/canvasStore";

export function useSelectedNode(projectId?: string, fileId?: string) {
  return useCanvasStore((state) =>
    projectId && fileId ? (state.canvases[projectId]?.files[fileId]?.selectedNode ?? null) : null
  );
}
