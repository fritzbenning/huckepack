import { useProject, useProjectManagerStore } from "@hub/projects";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { DEFAULT_DEPENDENCIES } from "../constants";
import { prepareDepsForPackageJson } from "../services/prepareDepsForPackageJson";

export const usePackageJson = (projectId: string | null | undefined) => {
  const { project } = useProject(projectId);
  const dependencies = useProjectManagerStore(
    useShallow((state) => state.projects[projectId ?? ""]?.dependencies ?? [])
  );

  const packageJsonString = useMemo(() => {
    const externalDeps = prepareDepsForPackageJson(DEFAULT_DEPENDENCIES, dependencies);

    const packageJson = {
      name: project?.name || "",
      description: "",
      version: "1.0.0",
      repository: {
        type: "git",
        url: "",
      },
      keywords: [],
      author: "",
      license: "ISC",
      dependencies: {
        ...DEFAULT_DEPENDENCIES,
        ...externalDeps,
      },
    };

    return JSON.stringify(packageJson, null, 2);
  }, [dependencies, project?.name]);

  return packageJsonString;
};
