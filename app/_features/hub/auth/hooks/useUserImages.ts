import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { useStableQuery } from "@shared/convex-helpers";

type ConvexTeamMember = {
  user: { _id: Id<"users">; [key: string]: unknown };
  role: string;
};

export function useUserImages(teamMembers: ConvexTeamMember[] | null) {
  const userIds = teamMembers?.map((tm) => tm.user._id) || [];
  const uniqueUserIds = [...new Set(userIds)] as Id<"users">[];

  const users = useStableQuery(api.users.getByIds, uniqueUserIds.length > 0 ? { userIds: uniqueUserIds } : "skip");

  return {
    users: (users ?? null) as Doc<"users">[] | null,
    loading: users === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
  };
}
