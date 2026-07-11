import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import type { Team } from "../types";

export const updateTeam = async (params: { id: string; name: string }): Promise<Team> => {
  const { id, name } = params;

  await convex.mutation(api.teams.update, {
    id: id as Id<"teams">,
    name: name.trim(),
  });

  const teamData = await convex.query(api.teams.get, {
    teamId: id as Id<"teams">,
  });

  if (!teamData) {
    throw new Error("Failed to fetch updated team");
  }

  const team: Team = {
    id: teamData._id,
    workspace_id: teamData.workspaceId,
    owner_id: teamData.ownerId,
    name: teamData.name,
    created_at: new Date(teamData.createdAt).toISOString(),
  };

  return team;
};
