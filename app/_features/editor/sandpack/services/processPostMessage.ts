import { setZoom } from "@editor/canvas";
import { setSelectedNode } from "@editor/canvas/stores/canvasStore";
import { updateNodeText } from "@editor/node-manager";
import { createSyntheticEvent, processKeyboardEvent } from "@keyboard-shortcuts";

export const processPostMessage = (
  event: MessageEvent,
  projectId: string,
  fileId: string,
  onSandpackReady?: () => void
) => {
  if (event.data.source === "markup-canvas") {
    if (event.data.action === "keyboardShortcut") {
      const syntheticEvent = createSyntheticEvent(event.data.data);
      processKeyboardEvent(syntheticEvent, projectId, fileId).catch((error) => {
        console.error("[processPostMessage] Error processing keyboard event:", error);
      });
    }

    if (event.data.action === "zoom") {
      const zoom = event.data.data;
      setZoom(projectId, zoom);
    }
  }

  if (event.data.source === "node-edit-utils") {
    if (event.data.action === "selectedNodeChanged") {
      setSelectedNode(projectId, fileId, event.data.data);
    }

    if (event.data.action === "textContentChanged") {
      const { nodeId, textContent, final } = event.data.data;
      if (nodeId && textContent !== undefined) {
        // TODO: Optimizie to support variables
        if (final) {
          updateNodeText({
            nodeId,
            textContent,
            projectId,
            fileId,
          });
        } else {
          // TODO: Update optimistic property defaultValue in fileManager
        }
      }
    }
  }

  if (event.data.source === "sandpack") {
    if (event.data.action === "sandpack-ready") {
      onSandpackReady?.();
    }
  }
};
