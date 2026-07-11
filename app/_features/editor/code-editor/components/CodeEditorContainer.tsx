import { useCanvasStore } from "@editor/canvas";
import { ErrorBoundary } from "@editor/error-boundary/components";
import { Activity, type ReactNode } from "react";

interface CodeEditorProps {
  projectId: string;
  children: ReactNode;
}

export function CodeEditorContainer({ projectId, children }: CodeEditorProps) {
  const showCodeEditor = useCanvasStore((state) => state.canvases[projectId].showCodeEditor);
  const focusMode = useCanvasStore((state) => state.canvases[projectId].focusMode);

  return (
    <Activity mode={!focusMode && showCodeEditor ? "visible" : "hidden"}>
      <div className="relative z-20 h-full w-1/2 max-w-2xl">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </Activity>
  );
}
