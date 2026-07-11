import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useStableQuery } from "@shared/convex-helpers";
import { useMutation } from "convex/react";

export function useProject(projectId: string | null | undefined) {
  const project = useStableQuery(api.projects.get, projectId ? { projectId: projectId as Id<"projects"> } : "skip");

  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.delete_);

  return {
    project: project || null,
    data: project || null,
    teamId: project?.teamId ?? null,
    loading: project === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
    updateProject,
    deleteProject,
  };
}
