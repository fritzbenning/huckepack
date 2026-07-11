import { useApplicationThemeStore } from "@application/theme";
import { useProjectRoutes, useRouterImports } from "@hub/projects";
import { useFiles } from "@project/file";
import { useTailwindThemeVersion } from "@project/theme";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { defaultImports } from "../constants";
import { generateAppTsx } from "../services/generateAppTsx";
import type { ImportDefinition, RouteDefinition } from "../types";

export const useAppSource = (projectId: string | null) => {
  const themeMode = useApplicationThemeStore((state) => state.themeMode);

  const routes = useProjectRoutes(projectId ?? "");
  const imports = useRouterImports(projectId ?? "");
  const { files } = useFiles(projectId);

  const { content: themeContent, loading: themesLoading } = useTailwindThemeVersion(projectId);

  const viewportWidthMap = useMemo(() => {
    if (!files) return {};
    const map: Record<string, number> = {};
    files.forEach((file) => {
      if (file._id) {
        map[file._id] = file.viewportWidth ?? 390;
      }
    });
    return map;
  }, [files]);

  const viewportBehaviorMap = useMemo(() => {
    if (!files) return {};
    const map: Record<string, "auto" | "fixed"> = {};
    files.forEach((file) => {
      if (file._id) {
        map[file._id] = file.viewportBehavior ?? "fixed";
      }
    });
    return map;
  }, [files]);

  const [appSource, setAppSource] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  const createAppSource = useEffectEvent(
    (
      imports: ImportDefinition[],
      routes: RouteDefinition[],
      themeContent: string,
      viewportWidthMap: Record<string, number>,
      viewportBehaviorMap: Record<string, "auto" | "fixed">
    ) => {
      const source = generateAppTsx(
        defaultImports.concat(imports),
        routes,
        themeContent,
        themeMode,
        viewportWidthMap,
        viewportBehaviorMap
      );
      setAppSource(source);
    }
  );

  useEffect(() => {
    if (themesLoading || !projectId) {
      setIsReady(false);
      return;
    }

    const filesLoaded = files !== undefined;
    const hasFiles = filesLoaded && (files?.length ?? 0) > 0;
    const hasRoutesOrImports = routes.length > 0 || imports.length > 0;
    const routesReady = filesLoaded && (!hasFiles || hasRoutesOrImports);

    if (routesReady) {
      createAppSource(imports, routes, themeContent, viewportWidthMap, viewportBehaviorMap);
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [
    imports,
    routes,
    themeContent,
    themesLoading,
    projectId,
    viewportWidthMap,
    viewportBehaviorMap,
    files,
    createAppSource,
  ]);

  return { appSource, isReady };
};
