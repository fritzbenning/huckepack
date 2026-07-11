import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import type { Project } from "../types";

export const createProject = async (params: {
  name: string;
  teamId: string;
  description?: string;
}): Promise<Project> => {
  const projectId = await convex.mutation(api.projects.create, {
    teamId: params.teamId as Id<"teams">,
    name: params.name,
    description: params.description,
  });

  if (!projectId) {
    throw new Error("Failed to create project");
  }

  const projectData = await convex.query(api.projects.get, { projectId });
  if (!projectData) {
    throw new Error("Failed to fetch created project");
  }

  const project: Project = {
    id: projectData._id,
    team_id: projectData.teamId,
    name: projectData.name,
    description: projectData.description || null,
    created_at: new Date(projectData.createdAt).toISOString(),
    sandpack_template: (projectData.sandpackTemplate as Project["sandpack_template"]) || "react",
    tsconfig: projectData.tsconfig ? JSON.stringify(projectData.tsconfig) : "{}",
  };

  return project;
};
