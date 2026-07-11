import { useShallow } from "zustand/react/shallow";
import { useProjectManagerStore } from "../stores/projectManagerStore";
import type { ImportDefinition } from "../types";

export function useRouterImports(projectId: string): ImportDefinition[] {
  return useProjectManagerStore(useShallow((state) => state.projects[projectId]?.routerImports ?? []));
}
