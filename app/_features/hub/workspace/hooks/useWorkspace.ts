import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useStableQuery } from "@shared/convex-helpers";
import { useMutation } from "convex/react";

export function useWorkspace(workspaceId: string | null | undefined) {
  const workspace = useStableQuery(
    api.workspaces.get,
    workspaceId ? { workspaceId: workspaceId as Id<"workspaces"> } : "skip"
  );

  const updateWorkspace = useMutation(api.workspaces.update);
  const deleteWorkspace = useMutation(api.workspaces.delete_);
  const addUser = useMutation(api.workspaces.addUser);
  const removeUser = useMutation(api.workspaces.removeUser);

  return {
    workspace: workspace || null,
    data: workspace || null,
    loading: workspace === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
    updateWorkspace,
    deleteWorkspace,
    addUser,
    removeUser,
  };
}
