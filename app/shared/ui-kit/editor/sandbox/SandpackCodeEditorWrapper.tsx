import { useActiveProjectStore } from "@stores/activeProjectStore";
import { getCanvasStore } from "@stores/instanceStoreManager";
import type { ReactNode } from "react";

interface SandpackCodeEditorWrapperProps {
  children: ReactNode;
}

export function SandpackCodeEditorWrapper({ children }: SandpackCodeEditorWrapperProps) {
  const showCodeEditor = getCanvasStore().getState().showCodeEditor;
  const focusMode = useActiveProjectStore((state) => state.focusMode);

  return (
    <div
      className={`relative z-20 h-full border-neutral-100 border-l-2 transition-all duration-600 ease-in-out dark:border-neutral-950 ${focusMode || !showCodeEditor ? "hidden" : ""} ${
        showCodeEditor ? "w-1/2 flex-1" : "w-0 flex-0"
      }`}
    >
      {children}
    </div>
  );
}
