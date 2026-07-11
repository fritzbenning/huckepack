import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useStableQuery } from "@shared/convex-helpers";
import { useMutation } from "convex/react";

export function useTeam(teamId: string | null | undefined) {
  const team = useStableQuery(api.teams.get, teamId ? { teamId: teamId as Id<"teams"> } : "skip");

  const updateTeam = useMutation(api.teams.update);
  const deleteTeam = useMutation(api.teams.delete_);
  const addUser = useMutation(api.teams.addUser);
  const removeUser = useMutation(api.teams.removeUser);
  const updateUserRole = useMutation(api.teams.updateUserRole);

  return {
    team: team || null,
    data: team || null,
    loading: team === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
    updateTeam,
    deleteTeam,
    addUser,
    removeUser,
    updateUserRole,
  };
}
