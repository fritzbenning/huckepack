import { addProject } from "../stores/projectManagerStore";

export const prepareProjectRoute = (projectId: string) => {
  addProject(projectId);

  // Return the path for the caller to navigate to
  return `/project/${projectId}/library`;
};
