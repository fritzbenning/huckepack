import { useTabStore } from "@editor/tabs";
import { getFileDependencies } from "@hub/projects";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { computeTransitiveDependencies } from "../utils/computeTransitiveDependencies";

export function useActiveFiles(projectId: string) {
  const openTabs = useTabStore(
    useShallow((state) => state.openTabs.filter((tab) => tab.projectId === projectId && tab.type === "file"))
  );

  const openFileIds = useMemo(() => openTabs.map((tab) => tab.id), [openTabs]);

  const openFileIdsKey = useMemo(() => openFileIds.sort().join(","), [openFileIds]);

  const fileDependencies = useMemo(() => getFileDependencies(projectId), [projectId]);

  const activeFiles = useMemo(() => {
    if (openFileIds.length === 0) {
      return [];
    }

    return computeTransitiveDependencies(openFileIds, fileDependencies);
  }, [openFileIdsKey, fileDependencies]);

  return { activeFiles, openFileIds };
}
