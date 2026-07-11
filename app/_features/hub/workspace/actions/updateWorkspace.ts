import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import type { Workspace } from "../types";

export const updateWorkspace = async (params: { id: string; name: string }): Promise<Workspace> => {
  const { id, name } = params;

  await convex.mutation(api.workspaces.update, {
    id: id as Id<"workspaces">,
    name: name.trim(),
  });

  const workspaceData = await convex.query(api.workspaces.get, {
    workspaceId: id as Id<"workspaces">,
  });

  if (!workspaceData) {
    throw new Error("Failed to fetch updated workspace");
  }

  const workspace: Workspace = {
    id: workspaceData._id,
    owner_id: workspaceData.ownerId,
    name: workspaceData.name,
    created_at: new Date(workspaceData.createdAt).toISOString(),
  };

  return workspace;
};
