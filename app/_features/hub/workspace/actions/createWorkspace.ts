import { api } from "@convex/_generated/api";
import { convex } from "@lib/convex";

export const createWorkspace = async (params: { name: string; id?: string }): Promise<{ workspaceId: string }> => {
  const workspaceId = await convex.mutation(api.workspaces.create, {
    name: params.name,
  });

  if (!workspaceId) {
    throw new Error("Failed to create workspace");
  }

  return { workspaceId };
};
