import type { ReactNode } from "react";

interface ToolbarContainerProps {
  children: ReactNode;
}

export function ToolbarContainer({ children }: ToolbarContainerProps) {
  return (
    <div className="-translate-x-1/2 absolute bottom-4 left-1/2 z-30 flex items-center justify-between gap-4 rounded-full bg-white/90 py-1 pr-4 pl-1 shadow-lg/5 ring-2 ring-neutral-200/25 backdrop-blur-md dark:bg-neutral-800/90 dark:ring-neutral-800/25">
      {children}
    </div>
  );
}
