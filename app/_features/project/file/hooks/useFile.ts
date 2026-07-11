import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

interface UseFileConfig {
  includeVersion?: boolean;
}

export function useFile(fileId: Id<"files"> | null | undefined, config: UseFileConfig = {}) {
  const { includeVersion = false } = config;
  const fileIdTyped = fileId;

  const fileWithVersion = useQuery(
    api.files.getWithVersion,
    includeVersion && fileIdTyped ? { fileId: fileIdTyped } : "skip"
  );

  const file = useQuery(api.files.get, !includeVersion && fileIdTyped ? { fileId: fileIdTyped } : "skip");
  const updateFile = useMutation(api.files.update);
  const deleteFile = useMutation(api.files.delete_);

  if (includeVersion) {
    return {
      file: fileWithVersion || null,
      data: fileWithVersion || null,
      loading: fileWithVersion === undefined,
      error: null,
      refetch: () => {}, // Convex queries are reactive
    };
  }

  return {
    file: file || null,
    data: file || null,
    loading: file === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
    updateFile,
    deleteFile,
  };
}
