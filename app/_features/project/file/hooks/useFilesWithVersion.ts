import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function useFilesWithVersion(projectId: string | null | undefined) {
  const files = useQuery(api.files.listMetadata, projectId ? { projectId: projectId as Id<"projects"> } : "skip");

  return {
    files: files || undefined,
    data: files || null,
    loading: files === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
  };
}
