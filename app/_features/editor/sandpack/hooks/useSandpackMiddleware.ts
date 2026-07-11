import type { SandpackPreviewRef } from "@codesandbox/sandpack-react";
import { useSelectedNode } from "@editor/canvas";
import { type RefObject, useCallback, useEffect, useEffectEvent } from "react";
import { sendPostMessage } from "../post-messages/sendSelectedNode";
import { processPostMessage } from "../services/processPostMessage";

export const useSandpackMiddleware = (
  ref: RefObject<SandpackPreviewRef | null>,
  projectId: string,
  fileId: string,
  currentFilePath?: string | null,
  onSandpackReady?: () => void
) => {
  const selectedNode = useSelectedNode(projectId, fileId ?? "");

  // 1. Process post messages

  const receivePostMessage = useEffectEvent((event: MessageEvent) => {
    try {
      if (
        event.data.source === "markup-canvas" ||
        event.data.source === "node-edit-utils" ||
        event.data.source === "sandpack"
      ) {
        processPostMessage(event, projectId, fileId ?? "", onSandpackReady);
      }
    } catch (error) {
      console.error("[SandpackMiddleware] Error processing post message:", error);
    }
  });

  useEffect(() => {
    window.addEventListener("message", receivePostMessage);

    return () => {
      window.removeEventListener("message", receivePostMessage);
    };
  }, []);

  // 2. Send parent events to the canvas

  // 2.1. Notify canvas when selected node changes
  useEffect(() => {
    sendPostMessage(ref, "selectedNodeChanged", selectedNode, "canvas");
  }, [selectedNode, ref]);

  // 2.2. Notify canvas when navigating to a new file
  useEffect(() => {
    if (currentFilePath) {
      // Normalize path by removing leading slashes to match route definitions
      const normalizedPath = currentFilePath.replace(/^\/+/, "");
      sendPostMessage(ref, "navigate", `/edit/${normalizedPath}`, "canvas");
      sendPostMessage(ref, "resetToInitial", null, "canvas");
    }
  }, [currentFilePath, ref]);

  // 2.3. Send zoom requests to the canvas
  const handleZoom = useCallback(() => {
    sendPostMessage(ref, "zoomIn", null, "canvas");
  }, [ref]);

  const setZoomToValue = useCallback(
    (zoom: number) => {
      sendPostMessage(ref, "setZoom", zoom, "canvas");
    },
    [ref]
  );

  return { handleZoom, setZoomToValue };
};
