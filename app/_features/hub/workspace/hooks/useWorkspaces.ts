import { api } from "@convex/_generated/api";
import { useStableQuery } from "@shared/convex-helpers";
import { useMutation } from "convex/react";
import type { Workspace } from "../types";

export function useWorkspaces(_ownerId: string | null | undefined) {
  const workspaces = useStableQuery(api.workspaces.list);

  const createWorkspace = useMutation(api.workspaces.create);

  const workspacesTransformed: Workspace[] = workspaces
    ? workspaces.map((w) => ({
        id: w._id,
        name: w.name,
        owner_id: w.ownerId,
        created_at: new Date(w.createdAt).toISOString(),
      }))
    : [];

  return {
    workspaces: workspacesTransformed,
    data: workspacesTransformed,
    loading: workspaces === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
    createWorkspace,
  };
}
