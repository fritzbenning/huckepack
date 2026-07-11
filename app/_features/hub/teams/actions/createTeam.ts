import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import type { Team, TeamMember } from "../types";

export const createTeam = async (params: {
  name: string;
  workspaceId: string;
  id?: string;
}): Promise<{ team: Team; teamMember: TeamMember }> => {
  const teamId = await convex.mutation(api.teams.create, {
    workspaceId: params.workspaceId as Id<"workspaces">,
    name: params.name,
  });

  if (!teamId) {
    throw new Error("Failed to create team");
  }

  const teamData = await convex.query(api.teams.get, { teamId });
  if (!teamData) {
    throw new Error("Failed to fetch created team");
  }

  const team: Team = {
    id: teamData._id,
    workspace_id: teamData.workspaceId,
    owner_id: teamData.ownerId,
    name: teamData.name,
    created_at: new Date(teamData.createdAt).toISOString(),
  };

  const teamMembers = await convex.query(api.teams.getUsers, { teamId });
  const ownerMember = teamMembers?.find((tm) => tm.role === "owner");

  const teamMember: TeamMember = {
    team_id: team.id,
    user_id: ownerMember?.user._id || teamData.ownerId,
    role: "owner",
  };

  return { team, teamMember };
};
