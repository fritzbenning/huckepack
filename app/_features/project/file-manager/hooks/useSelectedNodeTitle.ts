import type { Id } from "@convex/_generated/dataModel";
import { useSelectedNodeData } from "./useSelectedNodeData";

export function useSelectedNodeTitle(projectId?: Id<"projects">, fileId?: Id<"files">): string | null {
  const selectedNodeData = useSelectedNodeData(projectId, fileId);

  if (!selectedNodeData) return null;

  return selectedNodeData.titlePrefix
    ? `${selectedNodeData.titlePrefix} ${selectedNodeData.title}`
    : selectedNodeData.title;
}
