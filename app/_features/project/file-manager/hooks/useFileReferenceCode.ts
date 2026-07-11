import type { Id } from "@convex/_generated/dataModel";
import { useFileManagerStore } from "../stores/fileManagerStore";
import { normalizeProjectId } from "../utils/normalizeProjectId";

export function useFileReferenceCode(projectId?: Id<"projects">, fileId?: Id<"files">): string {
  return useFileManagerStore((state) => {
    if (!fileId) return "";
    const file = state.files[fileId];
    return file?.code?.reference ?? "";
  }, normalizeProjectId(projectId));
}
