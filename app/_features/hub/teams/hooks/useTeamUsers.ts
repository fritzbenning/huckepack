import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function useTeamMembers(teamId: string | null | undefined) {
  const teamIdTyped = teamId ? (teamId as Id<"teams">) : null;
  const users = useQuery(
    api.teams.getUsers,
    teamIdTyped ? { teamId: teamIdTyped } : "skip"
  );

  return {
    teamMembers: users || null,
    data: users || null,
    loading: users === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
  };
}
