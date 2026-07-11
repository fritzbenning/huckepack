import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useStableQuery } from "@shared/convex-helpers";
import type { Project } from "../types";

export function useProjects(teamId: Id<"teams"> | null | undefined) {
  const projects = useStableQuery(
    api.projects.list,
    teamId ? { teamId } : "skip"
  );

  const createProject = useMutation(api.projects.create);

  const projectsTransformed: Project[] | null = projects
    ? projects.map((p) => ({
        id: p._id,
        team_id: p.teamId,
        name: p.name,
        description: p.description || null,
        created_at: new Date(p.createdAt).toISOString(),
        sandpack_template: (p.sandpackTemplate as Project["sandpack_template"]) || "react",
        tsconfig: p.tsconfig ? JSON.stringify(p.tsconfig) : "{}",
      }))
    : null;

  return {
    projects: projectsTransformed,
    data: projectsTransformed,
    loading: projects === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
    createProject,
  };
}
