import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function useFileSearch(projectId: Id<"projects"> | null, query: string) {
  const files = useQuery(
    api.files.search,
    projectId && query ? { projectId, query } : "skip"
  );

  return {
    files,
    isLoading: files === undefined,
  };
}

