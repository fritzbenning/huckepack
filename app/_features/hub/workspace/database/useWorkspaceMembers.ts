import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function useWorkspaceMembers(workspaceId: Id<"workspaces"> | null) {
  const users = useQuery(
    api.workspaces.getUsers,
    workspaceId ? { workspaceId } : "skip"
  );

  return {
    users,
    isLoading: users === undefined,
  };
}

