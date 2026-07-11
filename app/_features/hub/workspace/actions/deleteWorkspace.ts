import { convex } from "@lib/convex";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

/**
 * Delete a workspace and all its teams, projects, files, and themes.
 * This action calls the Convex mutation which handles cascading deletion automatically.
 */
export const deleteWorkspace = async (params: { workspaceId: string }): Promise<boolean> => {
  const { workspaceId } = params;

  try {
    await convex.mutation(api.workspaces.delete_, {
      id: workspaceId as Id<"workspaces">,
    });
    return true;
  } catch (error) {
    console.error("Error deleting workspace:", error);
    throw error;
  }
};
