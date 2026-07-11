import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useStableQuery } from "@shared/convex-helpers";
import { useMemo } from "react";

export function useTeamsByOwner(userId: string | null | undefined) {
  const userIdTyped = userId ? (userId as Id<"users">) : null;
  const teams = useStableQuery(api.teams.getByOwner, userIdTyped ? { userId: userIdTyped } : "skip");

  const personalTeamId = useMemo(() => {
    return teams && teams.length > 0 ? teams[0]._id : null;
  }, [teams]);

  return {
    teams: teams || null,
    personalTeamId,
    isLoading: teams === undefined,
  };
}
