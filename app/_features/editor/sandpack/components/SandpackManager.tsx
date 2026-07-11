import type { SandpackPreviewRef } from "@codesandbox/sandpack-react";
import { useSandpack } from "@codesandbox/sandpack-react";
import type { RefObject } from "react";
import { useEffect } from "react";

interface SandpackManagerProps {
  currentPath: string;
  children: React.ReactNode;
  previewRef?: RefObject<SandpackPreviewRef | null>;
  onError?: (errorMessage: string) => void;
}

export function SandpackManager({ currentPath, children, onError }: SandpackManagerProps) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    sandpack.setActiveFile(currentPath);
  }, [currentPath]);

  useEffect(() => {
    const sandpackError = sandpack.error as { message?: string } | null | undefined;
    if (sandpackError?.message) {
      onError?.(sandpackError.message);
    }
  }, [sandpack.error, onError]);

  return <div className="h-full">{children}</div>;
}
