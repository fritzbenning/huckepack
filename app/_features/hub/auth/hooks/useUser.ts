import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function useUser(userId: string | null | undefined) {
  const userIdTyped = userId ? (userId as Id<"users">) : null;
  const user = useQuery(api.users.get, userIdTyped ? { userId: userIdTyped } : "skip");

  return {
    user: user || null,
    data: user || null,
    loading: user === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
  };
}
