import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function useFileVersion(fileId: Id<"files"> | null | undefined) {
  const fileVersion = useQuery(
    api.files.getCurrentVersion,
    fileId ? { fileId } : "skip"
  );

  return {
    fileVersion: fileVersion || null,
    data: fileVersion || null,
    loading: fileVersion === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
  };
}
