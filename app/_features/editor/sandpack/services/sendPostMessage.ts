import type { SandpackPreviewRef } from "@codesandbox/sandpack-react";
import type { RefObject } from "react";
import { getIframeWindow } from "../utils/getIframeWindow";

export const sendPostMessage = (
  iframe: RefObject<SandpackPreviewRef | null> | HTMLIFrameElement,
  action: string,
  args?: unknown[],
  canvasName?: string
): void => {
  const iframeWindow = getIframeWindow(iframe);

  if (!iframeWindow) {
    console.warn("[sendPostMessage] Cannot send message - iframe not available");
    return;
  }

  const message = {
    source: "markup-canvas",
    canvasName: canvasName ?? "canvas",
    action,
    args: args || [],
  };

  iframeWindow.postMessage(message, "*");
};
