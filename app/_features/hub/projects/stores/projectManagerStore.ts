import type { Id } from "@convex/_generated/dataModel";
import { addCanvas, clearCanvases, removeCanvas } from "@editor/canvas";
import type { ExternalDependency } from "@project/ast-parser";
import { getAllFiles } from "@project/file-manager";
import { mergeDependencies } from "@project/file-processor/utils/mergeDependencies";
import { createIndexedDBStorage } from "@shared/indexedDB";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { ImportDefinition, ProjectRoute } from "../types";

export interface Project {
  projectId: string;
  dependencies: ExternalDependency[];
  fileDependencies: Record<string, string[]>;
  routes?: ProjectRoute[];
  routerImports?: ImportDefinition[];
}

interface ProjectManagerStore {
  projects: Record<string, Project>;
  editorExplorerTab: string;
  editorInspectorTab: string;
}

const initialState: ProjectManagerStore = {
  projects: {},
  editorExplorerTab: "layers",
  editorInspectorTab: "design",
};

export const useProjectManagerStore = create<ProjectManagerStore>()(
  devtools(
    persist(
      () => ({
        ...initialState,
      }),
      {
        name: "project-manager-store",
        storage: createJSONStorage(() => createIndexedDBStorage()),
        partialize: (state) => ({
          projects: state.projects,
          editorExplorerTab: state.editorExplorerTab,
          editorInspectorTab: state.editorInspectorTab,
        }),
      }
    )
  )
);

export const addProject = (projectId: string) => {
  useProjectManagerStore.setState((state) => {
    if (state.projects[projectId]) {
      return state;
    }

    return {
      projects: {
        ...state.projects,
        [projectId]: { projectId, dependencies: [], fileDependencies: {}, routes: [], routerImports: [] },
      },
    };
  });

  addCanvas(projectId);
};

export const removeProject = (projectId: string) => {
  useProjectManagerStore.setState((state) => {
    const { [projectId]: _, ...remainingProjects } = state.projects;
    return { projects: remainingProjects };
  });

  removeCanvas(projectId);
};

export const getProjects = (): Record<string, Project> => {
  return useProjectManagerStore.getState().projects;
};

export const getAllProjects = (): Project[] => {
  return Object.values(useProjectManagerStore.getState().projects);
};

export const getProject = (projectId: string): Project | undefined => {
  return useProjectManagerStore.getState().projects[projectId];
};

export const isProjectOpen = (projectId: string): boolean => {
  return !!useProjectManagerStore.getState().projects[projectId];
};

export const clearProjects = () => {
  useProjectManagerStore.setState({ projects: {} });

  clearCanvases();
};

// Dependency management functions
export const updateProjectDependencies = (projectId: string, dependencies: ExternalDependency[]) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    return {
      projects: {
        ...state.projects,
        [projectId]: { ...project, dependencies },
      },
    };
  });
};

export const updateProjectStore = (
  projectId: string,
  updates: {
    fileDependencies?: { fileId: string; dependentFileIds: string[] };
    route?: ProjectRoute;
    routerImport?: ImportDefinition;
    dependencies?: ExternalDependency[];
  }
) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    let updatedProject = { ...project };

    if (updates.fileDependencies) {
      updatedProject = {
        ...updatedProject,
        fileDependencies: {
          ...updatedProject.fileDependencies,
          [updates.fileDependencies.fileId]: updates.fileDependencies.dependentFileIds,
        },
      };
    }

    if (updates.route) {
      const route = updates.route;
      const currentRoutes = updatedProject.routes ?? [];
      const routeWithFileId: ProjectRoute = { ...route };

      if (!routeWithFileId.fileId) {
        const allFiles = getAllFiles(projectId as Id<"projects">);
        const normalizedPath = route.path.replace(/^\/+/, "");
        const file = allFiles.find((f) => f.path === route.path || f.path === normalizedPath);
        if (file) {
          routeWithFileId.fileId = file.id;
        }
      }

      const existingRouteIndex = currentRoutes.findIndex((r) => r.path === route.path);

      let updatedRoutes: ProjectRoute[];
      if (existingRouteIndex >= 0) {
        const existingRoute = currentRoutes[existingRouteIndex];
        routeWithFileId.fileId = routeWithFileId.fileId || existingRoute.fileId;

        const isSame =
          existingRoute.component === routeWithFileId.component &&
          existingRoute.path === routeWithFileId.path &&
          existingRoute.fileId === routeWithFileId.fileId;

        if (!isSame) {
          updatedRoutes = [...currentRoutes];
          updatedRoutes[existingRouteIndex] = routeWithFileId;
        } else {
          updatedRoutes = currentRoutes;
        }
      } else {
        updatedRoutes = [...currentRoutes, routeWithFileId];
      }

      updatedProject = { ...updatedProject, routes: updatedRoutes };
    }

    if (updates.routerImport) {
      const routerImport = updates.routerImport;
      const currentImports = updatedProject.routerImports ?? [];
      const existingImportIndex = currentImports.findIndex((imp) => imp.from === routerImport.from);

      let updatedImports: ImportDefinition[];
      if (existingImportIndex >= 0) {
        const existingImport = currentImports[existingImportIndex];
        const isSame =
          existingImport.default === routerImport.default &&
          JSON.stringify(existingImport.what) === JSON.stringify(routerImport.what);

        if (!isSame) {
          updatedImports = [...currentImports];
          updatedImports[existingImportIndex] = routerImport;
        } else {
          updatedImports = currentImports;
        }
      } else {
        updatedImports = [...currentImports, routerImport];
      }

      updatedProject = { ...updatedProject, routerImports: updatedImports };
    }

    if (updates.dependencies && updates.dependencies.length > 0) {
      const mergedDependencies = mergeDependencies(updatedProject.dependencies, updates.dependencies);
      updatedProject = { ...updatedProject, dependencies: mergedDependencies };
    }

    return {
      projects: {
        ...state.projects,
        [projectId]: updatedProject,
      },
    };
  });
};

export const mergeProjectDependencies = (projectId: string, newDependencies: ExternalDependency[]) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    const mergedDependencies = mergeDependencies(project.dependencies, newDependencies);

    return {
      projects: {
        ...state.projects,
        [projectId]: { ...project, dependencies: mergedDependencies },
      },
    };
  });
};

export const getProjectDependencies = (projectId: string): ExternalDependency[] => {
  const project = useProjectManagerStore.getState().projects[projectId];
  return project?.dependencies ?? [];
};

// File dependencies management functions
export const updateFileDependencies = (projectId: string, fileId: string, dependentFileIds: string[]) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    return {
      projects: {
        ...state.projects,
        [projectId]: {
          ...project,
          fileDependencies: {
            ...project.fileDependencies,
            [fileId]: dependentFileIds,
          },
        },
      },
    };
  });
};

export const getFileDependencies = (projectId: string): Record<string, string[]> => {
  const project = useProjectManagerStore.getState().projects[projectId];
  return project?.fileDependencies ?? {};
};

export const getFileDependenciesForFile = (projectId: string, fileId: string): string[] => {
  const project = useProjectManagerStore.getState().projects[projectId];
  return project?.fileDependencies[fileId] ?? [];
};

export const removeFileDependencies = (projectId: string, fileId: string) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    const fileDependencies = { ...project.fileDependencies };

    // Remove the file's entry from fileDependencies
    delete fileDependencies[fileId];

    // Remove the fileId from all other files' dependency arrays
    const updatedFileDependencies: Record<string, string[]> = {};
    for (const [key, dependencies] of Object.entries(fileDependencies)) {
      updatedFileDependencies[key] = dependencies.filter((depId) => depId !== fileId);
    }

    return {
      projects: {
        ...state.projects,
        [projectId]: {
          ...project,
          fileDependencies: updatedFileDependencies,
        },
      },
    };
  });
};

export const removeFileRoutesAndImports = (projectId: string, filePath: string, fileName: string) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    // Remove routes where path matches filePath or component matches fileName
    const currentRoutes = project.routes ?? [];
    const updatedRoutes = currentRoutes.filter((route) => route.path !== filePath && route.component !== fileName);

    // Remove router imports where from matches filePath
    const currentImports = project.routerImports ?? [];
    const updatedImports = currentImports.filter((imp) => imp.from !== filePath);

    return {
      projects: {
        ...state.projects,
        [projectId]: {
          ...project,
          routes: updatedRoutes,
          routerImports: updatedImports,
        },
      },
    };
  });
};

export const addProjectRoute = (projectId: string, route: ProjectRoute) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    const currentRoutes = project.routes ?? [];

    // Look up fileId from path if missing
    const routeWithFileId: ProjectRoute = { ...route };
    if (!routeWithFileId.fileId) {
      const allFiles = getAllFiles(projectId as Id<"projects">);
      const normalizedPath = route.path.replace(/^\/+/, "");
      const file = allFiles.find((f) => f.path === route.path || f.path === normalizedPath);
      if (file) {
        routeWithFileId.fileId = file.id;
      }
    }

    // Check if route already exists
    const existingRouteIndex = currentRoutes.findIndex((r) => r.path === route.path);

    let updatedRoutes: ProjectRoute[];

    if (existingRouteIndex >= 0) {
      const existingRoute = currentRoutes[existingRouteIndex];

      // Ensure fileId is always included - use new route's fileId if provided, otherwise preserve existing
      routeWithFileId.fileId = routeWithFileId.fileId || existingRoute.fileId;

      // Compare existing route with new one (including fileId)
      const isSame =
        existingRoute.component === routeWithFileId.component &&
        existingRoute.path === routeWithFileId.path &&
        existingRoute.fileId === routeWithFileId.fileId;

      if (isSame) {
        return state;
      }

      // Update existing route with fileId
      updatedRoutes = [...currentRoutes];
      updatedRoutes[existingRouteIndex] = routeWithFileId;
    } else {
      // Add new route (ensure fileId is included)
      updatedRoutes = [...currentRoutes, routeWithFileId];
    }

    return {
      projects: {
        ...state.projects,
        [projectId]: { ...project, routes: updatedRoutes },
      },
    };
  });
};

export const removeProjectRoute = (projectId: string, path: string) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    const currentRoutes = project.routes ?? [];
    const updatedRoutes = currentRoutes.filter((r) => r.path !== path);

    return {
      projects: {
        ...state.projects,
        [projectId]: { ...project, routes: updatedRoutes },
      },
    };
  });
};

export const getProjectRoutes = (projectId: string): ProjectRoute[] => {
  const project = useProjectManagerStore.getState().projects[projectId];
  return project?.routes ?? [];
};

export const updateProjectRoutes = (projectId: string, routes: ProjectRoute[]) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    return {
      projects: {
        ...state.projects,
        [projectId]: { ...project, routes },
      },
    };
  });
};

// Router imports management functions
export const addRouterImport = (projectId: string, importDef: ImportDefinition) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    const currentImports = project.routerImports ?? [];

    // Check if import already exists (by from path)
    const existingImportIndex = currentImports.findIndex((imp) => imp.from === importDef.from);

    let updatedImports: ImportDefinition[];

    if (existingImportIndex >= 0) {
      const existingImport = currentImports[existingImportIndex];

      // Compare existing import with new one
      const isSame =
        existingImport.default === importDef.default &&
        JSON.stringify(existingImport.what) === JSON.stringify(importDef.what);

      if (isSame) {
        return state;
      }

      // Update existing import
      updatedImports = [...currentImports];
      updatedImports[existingImportIndex] = importDef;
    } else {
      // Add new import
      updatedImports = [...currentImports, importDef];
    }

    return {
      projects: {
        ...state.projects,
        [projectId]: { ...project, routerImports: updatedImports },
      },
    };
  });
};

export const removeRouterImport = (projectId: string, from: string) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    const currentImports = project.routerImports ?? [];
    const updatedImports = currentImports.filter((imp) => imp.from !== from);

    return {
      projects: {
        ...state.projects,
        [projectId]: { ...project, routerImports: updatedImports },
      },
    };
  });
};

export const getRouterImports = (projectId: string): ImportDefinition[] => {
  const project = useProjectManagerStore.getState().projects[projectId];
  return project?.routerImports ?? [];
};

export const updateRouterImports = (projectId: string, routerImports: ImportDefinition[]) => {
  useProjectManagerStore.setState((state) => {
    const project = state.projects[projectId];
    if (!project) return state;

    return {
      projects: {
        ...state.projects,
        [projectId]: { ...project, routerImports },
      },
    };
  });
};

// Editor tab management functions
export const setEditorExplorerTab = (tab: string) => {
  useProjectManagerStore.setState({ editorExplorerTab: tab });
};

export const setEditorInspectorTab = (tab: string) => {
  useProjectManagerStore.setState({ editorInspectorTab: tab });
};
