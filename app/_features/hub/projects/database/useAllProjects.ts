import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function useAllProjects() {
  const projects = useQuery(api.projects.listAll);

  return {
    projects,
    isLoading: projects === undefined,
  };
}

