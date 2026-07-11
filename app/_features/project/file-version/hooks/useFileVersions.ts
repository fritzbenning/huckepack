import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function useFileVersions(versionIds?: string[]) {
  // Note: Convex doesn't have a direct query for multiple file versions by IDs
  // This would need to be implemented in Convex or fetch individually
  // For now, return empty array if no IDs provided
  const fileVersions = useQuery(
    api.files.getCurrentVersion,
    versionIds && versionIds.length > 0 ? { fileId: versionIds[0] as Id<"files"> } : "skip"
  );

  // TODO: Implement proper multi-version query in Convex if needed
  return {
    fileVersions: fileVersions ? [fileVersions] : [],
    data: fileVersions ? [fileVersions] : [],
    loading: fileVersions === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
  };
}
