import { api } from "@convex/_generated/api";
import { useStableQuery } from "@shared/convex-helpers";

export function useCurrentUser() {
  const convexUser = useStableQuery(api.users.current);

  return {
    convexUser,
    isLoading: convexUser === undefined,
    githubAppId: convexUser?.githubAppId ?? null,
  };
}
