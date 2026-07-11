import type { SandpackPreviewRef } from "@codesandbox/sandpack-react";
import type { RefObject } from "react";

export const sendPostMessage = (ref: RefObject<SandpackPreviewRef | null>, action: string, data: unknown, canvasName?: string) => {
  const targetWindow = ref.current?.getClient()?.iframe?.contentWindow;

  if (targetWindow) {
    targetWindow.postMessage(
      {
        source: "application",
        action,
        data,
        ...(canvasName && { canvasName }),
      },
      "*"
    );
  }
};
