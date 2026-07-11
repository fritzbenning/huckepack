import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function useUserExists(userId: string | null | undefined) {
  const userIdTyped = userId ? (userId as Id<"users">) : null;
  const exists = useQuery(
    api.users.exists,
    userIdTyped ? { userId: userIdTyped } : "skip"
  );

  return {
    exists: exists ?? false,
    loading: exists === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
  };
}
