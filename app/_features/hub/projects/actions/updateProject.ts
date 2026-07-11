import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import type { Project } from "../types";

export const updateProject = async (params: { id: string; name: string; description?: string }): Promise<Project> => {
  const { id, name, description } = params;

  await convex.mutation(api.projects.update, {
    id: id as Id<"projects">,
    name: name.trim(),
    description: description !== undefined ? description : undefined,
  });

  const projectData = await convex.query(api.projects.get, {
    projectId: id as Id<"projects">,
  });

  if (!projectData) {
    throw new Error("Failed to fetch updated project");
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
