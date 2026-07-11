import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function useFileWithVersion(fileId: Id<"files"> | null) {
  const file = useQuery(
    api.files.getWithVersion,
    fileId ? { fileId } : "skip"
  );

  return {
    file,
    isLoading: file === undefined,
  };
}

