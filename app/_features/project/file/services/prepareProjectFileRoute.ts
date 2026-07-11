import { addProject } from "@hub/projects";

export const prepareProjectFileRoute = (projectId: string, fileId: string) => {
  addProject(projectId);

  return `/project/${projectId}/file/${fileId}`;
};
