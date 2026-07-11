import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function useTheme(themeId: string | null | undefined) {
  const theme = useQuery(api.themes.getWithVersion, themeId ? { themeId: themeId as Id<"themes"> } : "skip");

  return {
    theme: theme || null,
    data: theme || null,
    loading: theme === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
  };
}
