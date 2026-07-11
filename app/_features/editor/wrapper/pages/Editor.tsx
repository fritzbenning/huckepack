import { SandpackLayout, SandpackPreview, type SandpackPreviewRef } from "@codesandbox/sandpack-react";
import { PerformanceViewer } from "@application/performance";
import { useCanvasStore } from "@editor/canvas";
import { CodeEditor, CodeEditorContainer } from "@editor/code-editor";
import { EditorErrorFallback, ErrorBoundary } from "@editor/error-boundary/components";
import { ExplorerAside } from "@editor/explorer-aside/components/ExplorerAside";
import { FloatingToolbar } from "@editor/floating-toolbar";
import { InspectorAside } from "@editor/inspector-aside";
import { useResizePanels } from "@editor/resize-panels";
import { SandpackInstance, SandpackManager, useSandpackMiddleware } from "@editor/sandpack";
import { Spotlight } from "@editor/spotlight";
import { useSWC } from "@hooks/application/useSWC";
import { useParamIds } from "@hooks/useParamIds";
import { useKeyboardShortcuts } from "@keyboard-shortcuts";
import { cn } from "@lib/utils";
import { useFile } from "@project/file";
import { useStoreFile } from "@project/file-manager";
import { EditorBodyModal, useEditorBodyModalStore } from "@shared/body-modal";
import { PinnedModal } from "@shared/pinned-modal";
import { Spinner } from "@shared/ui-kit/ui/Spinner";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Editor() {
  const { projectId, fileId } = useParamIds();
  useSWC();
  useFile(fileId);
  //usePreloadHistory(fileId, projectId);

  const { file: currentFile, isHydrated } = useStoreFile(fileId, projectId!);

  const focusMode = useCanvasStore((state) => {
    const canvas = state.canvases[projectId ?? ""];
    return canvas?.focusMode ?? false;
  });

  const { panelSizes, handleLeftPanelResize, handleRightPanelResize } = useResizePanels();

  const sandpackLayoutRef = useRef<HTMLDivElement>(null);
  const sandpackPreviewRef = useRef<SandpackPreviewRef | null>(null);
  const [isSandpackReady, setIsSandpackReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [sandpackErrorMessage, setSandpackErrorMessage] = useState<string | null>(null);
  const isTimelineOpen = useEditorBodyModalStore((state) => state.currentModal === "history.timeline" && state.isOpen);

  const handleSandpackReady = useCallback(() => {
    setIsSandpackReady(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsSandpackReady(true);
  }, []);

  const handleSandpackError = useCallback((errorMessage: string) => {
    setSandpackErrorMessage(errorMessage);
    console.error(errorMessage);
    setHasError(true);
    setIsSandpackReady(true);
  }, []);

  const { setZoomToValue } = useSandpackMiddleware(
    sandpackPreviewRef,
    projectId ?? "",
    fileId ?? "",
    currentFile?.path,
    handleSandpackReady
  );

  useKeyboardShortcuts({
    projectId: projectId ?? "",
    fileId: fileId ?? "",
    excludeTargets: ["INPUT", "TEXTAREA"],
  });

  if (!isHydrated) {
    return null;
  }

  if (!currentFile) {
    return (
      <EditorErrorFallback
        message="The requested file could not be found. It may have been deleted or moved."
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!projectId) {
    return (
      <EditorErrorFallback
        message="Project ID is missing. Please navigate from a valid project."
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!fileId) {
    return (
      <EditorErrorFallback
        message="File ID is missing. Please select a file to edit."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <ErrorBoundary
      fallback={(error) => (
        <EditorErrorFallback
          message={error?.message || "An error occurred while loading the editor. Please try refreshing the page."}
          onRetry={() => window.location.reload()}
        />
      )}
    >
      <SandpackInstance projectId={projectId} currentPath={currentFile.path}>
        <SandpackManager currentPath={currentFile.path} previewRef={sandpackPreviewRef} onError={handleSandpackError}>
          <PanelGroup direction="horizontal" className="h-full w-full">
            {!focusMode && (
              <>
                <Panel
                  defaultSize={panelSizes.left}
                  minSize={panelSizes.minSize}
                  maxSize={panelSizes.maxSize}
                  onResize={handleLeftPanelResize}
                  className="relative h-full min-h-0 min-w-74"
                >
                  {fileId && projectId && <ExplorerAside projectId={projectId} fileId={fileId} />}
                </Panel>
                <PanelResizeHandle className="-ml-1 relative z-20 w-1 bg-transparent transition-colors hover:bg-neutral-300 dark:hover:bg-neutral-600" />
              </>
            )}
            <Panel className="h-full min-h-0">
              <div
                className={cn(
                  "relative flex h-full w-full flex-col overflow-hidden",
                  isTimelineOpen && "grid grid-rows-[1fr_auto]"
                )}
              >
                <AnimatePresence>
                  {!isSandpackReady && !hasError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10"
                    >
                      <Spinner size="lg" label="Warming up canvas ..." />
                    </motion.div>
                  )}
                </AnimatePresence>
                <SandpackLayout
                  ref={sandpackLayoutRef}
                  className={cn(
                    "h-full w-full rounded-none! border-0! transition-opacity delay-200",
                    isSandpackReady || hasError ? "opacity-100" : "opacity-0",
                    isTimelineOpen && "min-h-0"
                  )}
                >
                  <div className="editor relative h-full flex-1">
                    <PerformanceViewer />
                    {sandpackErrorMessage ? (
                      <EditorErrorFallback
                        message={sandpackErrorMessage}
                        onRetry={() => {
                          setSandpackErrorMessage(null);
                          setHasError(false);
                          window.location.reload();
                        }}
                      />
                    ) : (
                      <ErrorBoundary
                        onError={handleError}
                        fallback={(error) => (
                          <EditorErrorFallback
                            message={
                              error?.message ||
                              "An error occurred while rendering the preview. This might be due to an invalid component or import issue."
                            }
                            onRetry={() => window.location.reload()}
                          />
                        )}
                      >
                        <SandpackPreview
                          ref={sandpackPreviewRef}
                          startRoute={`/edit/${currentFile.path?.replace(/^\/+/, "") || ""}`}
                          showOpenInCodeSandbox={false}
                          showRefreshButton={false}
                          showSandpackErrorOverlay={true}
                          style={{
                            width: "100%",
                            height: "100%",
                            margin: "0 auto",
                          }}
                        />
                      </ErrorBoundary>
                    )}
                    <FloatingToolbar projectId={projectId} fileId={fileId} setZoomToValue={setZoomToValue} />
                  </div>
                  <CodeEditorContainer projectId={projectId}>
                    <CodeEditor />
                  </CodeEditorContainer>
                </SandpackLayout>
                <PinnedModal />
                {isTimelineOpen && <EditorBodyModal />}
                {projectId && <Spotlight projectId={projectId} />}
              </div>
            </Panel>
            {!focusMode && (
              <>
                <PanelResizeHandle className="-mr-1 relative z-20 w-1 bg-transparent transition-colors hover:bg-neutral-300 dark:hover:bg-neutral-600" />
                <Panel
                  defaultSize={panelSizes.right}
                  minSize={panelSizes.minSize}
                  maxSize={panelSizes.maxSize}
                  onResize={handleRightPanelResize}
                  className="relative h-full min-h-0 min-w-74"
                >
                  {fileId && <InspectorAside projectId={projectId ?? ""} fileId={fileId} />}
                </Panel>
              </>
            )}
          </PanelGroup>
        </SandpackManager>
      </SandpackInstance>
    </ErrorBoundary>
  );
}
