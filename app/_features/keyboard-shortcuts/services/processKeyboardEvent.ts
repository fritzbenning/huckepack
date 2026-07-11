import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { getFocusMode, getSelectedNode, setActiveTool, toggleFocusMode } from "@editor/canvas";
import { redo, undo } from "@editor/history/actions/undoRedo";
import type { HierarchicalTreeNode } from "@editor/layer-tree";
import { getSandpackPreviewElement, sendPostMessage } from "@editor/sandpack";
import { editorShortcuts, sandpackShortcuts } from "@keyboard-shortcuts/config";
import { matchesExcludedModifiers } from "@keyboard-shortcuts/utils/matchesExcludedModifiers";
import { matchesRequiredModifiers } from "@keyboard-shortcuts/utils/matchesRequiredModifiers";
import { convex } from "@lib/convex";
import { getFileLayerTree } from "@project/file-manager";
import { executeAction } from "@shared/action";

export async function processKeyboardEvent(event: KeyboardEvent, projectId: string, fileId: string) {
  if (!projectId || !fileId || projectId === "" || fileId === "") {
    return;
  }

  const fileIdAsId = fileId as Id<"files">;
  const projectIdAsId = projectId as Id<"projects">;

  const isArrowKey = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key);
  const selectedNodeId = getSelectedNode(projectId, fileId);
  const skipSandpackShortcuts = isArrowKey && selectedNodeId !== null;

  if (!skipSandpackShortcuts) {
    const sandpackShortcut = sandpackShortcuts.find((shortcut) => {
      // Check if the key matches
      if (!shortcut.keys.includes(event.key)) {
        return false;
      }

      // Check if required modifiers match
      if (!matchesRequiredModifiers(event, shortcut.modifiers)) {
        return false;
      }

      // Check if excluded modifiers are not present
      if (!matchesExcludedModifiers(event, shortcut.excludeModifiers)) {
        return false;
      }

      return true;
    });

    if (sandpackShortcut) {
      const previewElement = getSandpackPreviewElement();

      if (previewElement) {
        sendPostMessage(previewElement, sandpackShortcut.action, undefined, "canvas");
      } else {
        console.warn("[KeyboardShortcuts] Preview element not found");
      }
      return;
    }
  }

  // Check editor shortcuts
  const editorShortcut = editorShortcuts.find((shortcut) => {
    // Check if the key matches
    if (!shortcut.keys.includes(event.key)) {
      return false;
    }

    // Check if required modifiers match
    if (!matchesRequiredModifiers(event, shortcut.modifiers)) {
      return false;
    }

    // Check if excluded modifiers are not present
    if (!matchesExcludedModifiers(event, shortcut.excludeModifiers)) {
      return false;
    }

    return true;
  });

  if (editorShortcut) {
    if (!projectId || !fileId) {
      console.warn("[KeyboardShortcuts] Missing projectId or fileId, cannot execute editor shortcut");
      return;
    }

    if (editorShortcut.action === "node.delete") {
      event.preventDefault();
      event.stopPropagation();

      if (!selectedNodeId) {
        console.warn("[KeyboardShortcuts] No node selected, cannot delete");
        return;
      }

      executeAction("node.delete", {
        nodeId: selectedNodeId,
        projectId,
        fileId,
      }).catch((error) => {
        console.error("[KeyboardShortcuts] Failed to execute delete action:", error);
      });
    } else if (editorShortcut.action === "node.move.up" || editorShortcut.action === "node.move.down") {
      if (!selectedNodeId) {
        // No node selected, allow default behavior (canvas scrolling)
        return;
      }

      // Get the layerTree to check parent's flex direction
      const layerTree = getFileLayerTree(fileIdAsId, projectIdAsId);
      if (!layerTree || !layerTree.flat[selectedNodeId]) {
        console.warn("[KeyboardShortcuts] Could not get layerTree or selected node not found");
        return;
      }

      // Find the parent node ID by searching the hierarchical tree
      const findParentNodeId = (nodes: HierarchicalTreeNode[], targetId: string): string | null => {
        for (const node of nodes) {
          // Check if any child matches the target
          if (node.children.some((child) => child.id === targetId)) {
            return node.id;
          }
          // Recursively search children
          const found = findParentNodeId(node.children, targetId);
          if (found) return found;
        }
        return null;
      };

      const parentNodeId = findParentNodeId(layerTree.hierarchical, selectedNodeId);
      if (!parentNodeId) {
        // Node is at top level, cannot move
        return;
      }

      // Get parent node classes from the flat tree
      const parentNode = layerTree.flat[parentNodeId];
      let isFlexCol = false;
      let hasFlexRow = false;

      if (parentNode?.classes) {
        const classTokens = parentNode.classes.classTokens || [];
        isFlexCol = classTokens.includes("flex-col");
        hasFlexRow = classTokens.includes("flex-row");
      }

      // Map arrow keys based on flex direction
      let shouldMove = false;
      let moveAction: "node.move.up" | "node.move.down" | null = null;

      if (isFlexCol) {
        // For flex-col: ArrowUp/Down move the node
        if (event.key === "ArrowUp") {
          shouldMove = true;
          moveAction = "node.move.up";
        } else if (event.key === "ArrowDown") {
          shouldMove = true;
          moveAction = "node.move.down";
        }
      } else if (hasFlexRow) {
        // For flex-row: ArrowLeft/Right move the node
        if (event.key === "ArrowLeft") {
          shouldMove = true;
          moveAction = "node.move.up";
        } else if (event.key === "ArrowRight") {
          shouldMove = true;
          moveAction = "node.move.down";
        }
      } else {
        // No flex class: ArrowUp/Down work (default to vertical layout)
        if (event.key === "ArrowUp") {
          shouldMove = true;
          moveAction = "node.move.up";
        } else if (event.key === "ArrowDown") {
          shouldMove = true;
          moveAction = "node.move.down";
        }
      }

      if (shouldMove && moveAction) {
        // Prevent default behavior to avoid canvas scrolling
        event.preventDefault();
        event.stopPropagation();

        executeAction(moveAction, {
          nodeId: selectedNodeId,
          projectId,
          fileId,
        })
          .then((result) => {
            const typedResult = result as { success: boolean; error?: string };
            if (!typedResult.success) {
              console.warn(`[KeyboardShortcuts] ${moveAction} action failed:`, typedResult.error);
            } else {
            }
          })
          .catch((error) => {
            console.error(`[KeyboardShortcuts] Failed to execute ${moveAction} action:`, error);
          });
      } else {
      }
    } else if (editorShortcut.action === "canvas.toggleFocusMode") {
      event.preventDefault();
      event.stopPropagation();

      const currentFocusMode = getFocusMode(projectId);
      toggleFocusMode(projectId);

      // Set active tool based on focus mode state
      if (!currentFocusMode) {
        // Enabling focus mode -> set to test-tool
        setActiveTool(projectId, "test-tool");
      } else {
        // Disabling focus mode -> set to edit-tool
        setActiveTool(projectId, "edit-tool");
      }
    } else if (editorShortcut.action === "history.undo") {
      event.preventDefault();
      event.stopPropagation();

      try {
        const history = await convex.query(api.files.getHistory, {
          fileId: fileIdAsId,
        });
        if (history) {
          await undo(fileIdAsId, projectIdAsId, history);
        }
      } catch (error) {
        console.error("[KeyboardShortcuts] Failed to undo:", error);
      }
    } else if (editorShortcut.action === "history.redo") {
      event.preventDefault();
      event.stopPropagation();

      try {
        const history = await convex.query(api.files.getHistory, {
          fileId: fileIdAsId,
        });
        if (history) {
          await redo(fileIdAsId, projectIdAsId, history);
        }
      } catch (error) {
        console.error("[KeyboardShortcuts] Failed to redo:", error);
      }
    } else if (editorShortcut.action === "spotlight.open") {
      event.preventDefault();
      event.stopPropagation();

      const { useSpotlightStore } = await import("@editor/spotlight/stores/spotlightStore");
      useSpotlightStore.getState().openSpotlight();
    } else {
      console.warn(`[KeyboardShortcuts] Unknown editor action: ${editorShortcut.action}`);
    }
  }
}
