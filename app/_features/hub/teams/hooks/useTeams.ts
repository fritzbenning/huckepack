import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function useTeams(workspaceId: string | null | undefined) {
  const workspaceIdTyped = workspaceId ? (workspaceId as Id<"workspaces">) : null;
  const teams = useQuery(
    api.teams.list,
    workspaceIdTyped ? { workspaceId: workspaceIdTyped } : "skip"
  );

  const createTeam = useMutation(api.teams.create);

  return {
    teams: teams || [],
    data: teams || [],
    loading: workspaceIdTyped ? teams === undefined : false,
    error: null,
    refetch: () => {}, // Convex queries are reactive
    createTeam,
  };
}
