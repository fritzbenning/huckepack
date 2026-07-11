import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function useTailwindThemeVersion(projectId: string | null | undefined, version?: number) {
  const theme = useQuery(
    api.themes.getTailwindThemeVersionForProject,
    projectId ? { projectId: projectId as Id<"projects">, version: version ?? 1 } : "skip"
  );

  return {
    theme: theme || null,
    content: theme?.currentContent || theme?.content || "",
    version: theme?.version || null,
    loading: theme === undefined,
    error: null,
  };
}
