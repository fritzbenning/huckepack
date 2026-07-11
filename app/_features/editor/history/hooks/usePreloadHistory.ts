import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { updateFileHistory } from "@project/file-manager";
import { useQuery } from "convex/react";
import { useEffect } from "react";

export function usePreloadHistory(fileId: Id<"files"> | undefined, projectId?: Id<"projects">): void {
  const history = useQuery(api.files.getHistory, fileId ? { fileId } : "skip");

  useEffect(() => {
    if (history && fileId && projectId) {
      updateFileHistory(fileId, history, projectId);
    }
  }, [history, fileId, projectId]);
}
