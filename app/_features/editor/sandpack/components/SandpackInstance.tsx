import { useTheme } from "@application/theme";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import type { Id } from "@convex/_generated/dataModel";
import { EDITOR_THEME } from "@editor/code-editor/theme";
import { useProject } from "@hub/projects";
import { useFileManagerStore } from "@project/file-manager";
import { useFileProcessor } from "@project/file-processor";
import { usePackageJson } from "@repo/package-json";
import { useAppSource } from "@sandpack/router";
import { externalResources } from "@sandpack/router/constants";
import { FadeIn } from "@shared/ui-kit/animations/FadeIn";
import { Spinner } from "@shared/ui-kit/ui/Spinner";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { toolkitFiles } from "../constants";

export default function SandpackInstance({
  children,
  projectId,
  currentPath,
}: {
  children: React.ReactNode;
  projectId: Id<"projects">;
  currentPath?: string;
}) {
  const [isReady, setIsReady] = useState(false);
  const { themeMode } = useTheme();

  // 1. Get project data
  const { project } = useProject(projectId);

  // 2. Get package.json
  const packageJson = usePackageJson(projectId);

  // 3. Create App.tsx
  const { appSource, isReady: appSourceReady } = useAppSource(projectId);

  // 4. Get initial file setup (for loading state)
  const { loading } = useFileProcessor(projectId);

  // 5. Get reactive sandpackFiles from FileManagerStore
  const projectFiles = useFileManagerStore((state) => state.sandpackFiles, projectId);

  useEffect(() => {
    setIsReady(!loading && appSourceReady && appSource.length > 0);
  }, [loading, appSourceReady, appSource.length]);

  return (
    <AnimatePresence mode="wait">
      {!isReady ? (
        <FadeIn key="loading" className="flex h-full w-full items-center justify-center">
          <Spinner size="lg" label="Loading project ..." />
        </FadeIn>
      ) : (
        <FadeIn key="sandpack" className="h-full w-full">
          <SandpackProvider
            template="react-ts"
            options={{
              externalResources,
              recompileMode: "immediate",
              recompileDelay: 100,
              autorun: true,
              visibleFiles: currentPath ? [currentPath] : [],
              activeFile: currentPath,
            }}
            files={{
              "/package.json": packageJson,
              "/tsconfig.json": project?.tsconfig || "",
              "/App.tsx": appSource,
              "/styles.css": "",
              ...projectFiles,
              ...toolkitFiles,
            }}
            theme={themeMode === "dark" ? EDITOR_THEME.dark : EDITOR_THEME.light}
          >
            {children}
          </SandpackProvider>
        </FadeIn>
      )}
    </AnimatePresence>
  );
}
