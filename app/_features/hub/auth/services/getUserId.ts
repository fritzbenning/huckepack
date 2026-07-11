import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

/**
 * Hook to get the current user ID from Convex
 */
export const useUserId = () => {
  const user = useQuery(api.users.current);
  return user?._id ?? null;
};
