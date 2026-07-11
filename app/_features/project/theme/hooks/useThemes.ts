import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function useThemes(projectId: string | null | undefined) {
  const themes = useQuery(api.themes.list, projectId ? { projectId: projectId as Id<"projects"> } : "skip");

  return {
    themes: themes || [],
    data: themes || [],
    loading: themes === undefined,
    error: null,
  };
}
