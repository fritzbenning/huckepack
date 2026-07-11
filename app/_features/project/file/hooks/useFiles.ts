import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useStableQuery } from "@shared/convex-helpers";
import { useMutation } from "convex/react";

export function useFiles(projectId: string | null | undefined) {
  const files = useStableQuery(api.files.listMetadata, projectId ? { projectId: projectId as Id<"projects"> } : "skip");

  const createFile = useMutation(api.files.create);
  const batchUpdate = useMutation(api.files.batchUpdate);

  return {
    files: files || null,
    data: files || null,
    loading: files === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive, no manual refetch needed
    createFile,
    batchUpdate,
  };
}
