import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";

export const deleteProject = async (params: { projectId: string }): Promise<boolean> => {
  const { projectId } = params;

  try {
    // Unpin project if pinned (handled by Convex mutation)
    await convex.mutation(api.pinnedItems.unpin, {
      entityType: "project",
      entityId: projectId,
    });
  } catch (error) {
    // Project may not be pinned, continue with deletion
    console.error("Project was not pinned or error unpinning:", error);
  }

  try {
    // Delete project using Convex mutation
    await convex.mutation(api.projects.delete_, {
      id: projectId as Id<"projects">,
    });
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
