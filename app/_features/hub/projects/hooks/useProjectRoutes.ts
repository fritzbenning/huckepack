import { useShallow } from "zustand/react/shallow";
import { useProjectManagerStore } from "../stores/projectManagerStore";
import type { ProjectRoute } from "../types";

export function useProjectRoutes(projectId: string): ProjectRoute[] {
  return useProjectManagerStore(useShallow((state) => state.projects[projectId]?.routes ?? []));
}
