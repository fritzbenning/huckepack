import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";

export const deleteTeam = async (params: { teamId: string }): Promise<boolean> => {
  const { teamId } = params;

  try {
    await convex.mutation(api.teams.delete_, {
      id: teamId as Id<"teams">,
    });
    return true;
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
};
