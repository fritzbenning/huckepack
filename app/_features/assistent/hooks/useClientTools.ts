import type { Id } from "@convex/_generated/dataModel";
import { getSelectedNode } from "@editor/canvas/stores/canvasStore";
import { getFileChatThread, getFileManagerStore } from "@project/file-manager/stores/fileManagerStore";
import { executeAction } from "@shared/action/executeAction";
import type { ActionParams } from "@shared/action/types";
import { useCallback } from "react";

interface UseClientToolsParams {
  projectId?: Id<"projects">;
  currentFileId?: Id<"files">;
  threadId?: string;
}

const SERVER_SIDE_TOOLS = [
  "getCurrentFile",
  "getProjectFiles",
  "getFileContent",
  "getTailwindTheme",
  "updateFileContent",
  "updateTailwindTheme",
  "createFile",
] as const;

export function useClientTools({ projectId, currentFileId, threadId }: UseClientToolsParams) {
  const getNodeStart = useCallback((targetProjectId: Id<"projects">, targetFileId: Id<"files">): number | undefined => {
    const selectedNodeId = getSelectedNode(targetProjectId, targetFileId);
    if (selectedNodeId) {
      const fileManagerStore = getFileManagerStore(targetProjectId);
      const fileState = fileManagerStore.getState().files[targetFileId];
      const nodeData = fileState?.layerTree?.flat[selectedNodeId];
      return nodeData?.classes?.span?.start;
    }
    return undefined;
  }, []);

  const handleToolCall = useCallback(
    async (toolCall: { toolName: string; args: unknown }): Promise<string | undefined> => {
      const { toolName, args } = toolCall;

      // Let server-side tools execute on the backend
      if (SERVER_SIDE_TOOLS.includes(toolName as (typeof SERVER_SIDE_TOOLS)[number])) {
        return undefined;
      }

      if (toolName === "getChatHistory") {
        const params = args as { fileId?: string; threadId?: string };
        const targetFileId = (params.fileId || currentFileId) as Id<"files"> | undefined;
        const targetThreadId = params.threadId || threadId;

        if (!targetFileId || !projectId) {
          return JSON.stringify({ error: "fileId and projectId are required" });
        }

        if (!targetThreadId) {
          return JSON.stringify({ error: "threadId is required" });
        }

        try {
          const thread = getFileChatThread(targetFileId, targetThreadId, projectId);
          if (!thread) {
            return JSON.stringify({ error: "Thread not found" });
          }

          return JSON.stringify({
            messages: thread.messages,
            threadId: thread.threadId,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
          });
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      if (toolName === "displayDesignTokens") {
        const params = args as { tokens: Array<{ name: string; value: string; type: string; description?: string }> };
        return JSON.stringify(params.tokens);
      }

      if (toolName === "createWorkspace") {
        try {
          const result = await executeAction("workspace.create", args as ActionParams<"workspace.create">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "updateWorkspace") {
        try {
          const result = await executeAction("workspace.update", args as ActionParams<"workspace.update">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "deleteWorkspace") {
        try {
          const result = await executeAction("workspace.delete", args as ActionParams<"workspace.delete">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "createTeam") {
        try {
          const result = await executeAction("team.create", args as ActionParams<"team.create">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "updateTeam") {
        try {
          const result = await executeAction("team.update", args as ActionParams<"team.update">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "deleteTeam") {
        try {
          const result = await executeAction("team.delete", args as ActionParams<"team.delete">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "createProject") {
        try {
          const result = await executeAction("project.create", args as ActionParams<"project.create">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "updateProject") {
        try {
          const result = await executeAction("project.update", args as ActionParams<"project.update">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "deleteProject") {
        try {
          const result = await executeAction("project.delete", args as ActionParams<"project.delete">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      // if (toolName === "createFile") {
      //   try {
      //     const normalizedArgs = { ...(args as Record<string, unknown>) };
      //     if (projectId && !normalizedArgs.projectId) {
      //       normalizedArgs.projectId = projectId;
      //     }
      //     const result = await executeAction("file.create", normalizedArgs as unknown as ActionParams<"file.create">);
      //     return JSON.stringify(result);
      //   } catch (error) {
      //     return JSON.stringify({
      //       error: error instanceof Error ? error.message : "Unknown error",
      //       action: toolName,
      //     });
      //   }
      // }

      if (toolName === "updateFile") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          const result = await executeAction("file.update", normalizedArgs as ActionParams<"file.update">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "deleteFile") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          const result = await executeAction("file.delete", normalizedArgs as unknown as ActionParams<"file.delete">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "renameComponent") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          const result = await executeAction(
            "file.renameComponent",
            normalizedArgs as unknown as ActionParams<"file.renameComponent">
          );
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "updateFileCode") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          const result = await executeAction(
            "file.updateCode",
            normalizedArgs as unknown as ActionParams<"file.updateCode">
          );
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "createTheme") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          const result = await executeAction("theme.create", normalizedArgs as unknown as ActionParams<"theme.create">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "getTheme") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          const result = await executeAction("theme.get", normalizedArgs as unknown as ActionParams<"theme.get">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "updateTheme") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          const result = await executeAction("theme.update", normalizedArgs as unknown as ActionParams<"theme.update">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "deleteTheme") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          const result = await executeAction("theme.delete", normalizedArgs as unknown as ActionParams<"theme.delete">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "pinEntity") {
        try {
          const result = await executeAction("hub.pin", args as ActionParams<"hub.pin">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "unpinEntity") {
        try {
          const result = await executeAction("hub.unpin", args as ActionParams<"hub.unpin">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "getCurrentNode") {
        try {
          const result = await executeAction("node.current.get", args as ActionParams<"node.current.get">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "addNodeClass") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          if (!normalizedArgs.nodeStart && projectId && currentFileId) {
            const nodeStart = getNodeStart(projectId, currentFileId);
            if (nodeStart) {
              normalizedArgs.nodeStart = nodeStart;
            }
          }
          const result = await executeAction(
            "node.class.add",
            normalizedArgs as unknown as ActionParams<"node.class.add">
          );
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "removeNodeClass") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          if (!normalizedArgs.nodeStart && projectId && currentFileId) {
            const nodeStart = getNodeStart(projectId, currentFileId);
            if (nodeStart) {
              normalizedArgs.nodeStart = nodeStart;
            }
          }
          const result = await executeAction(
            "node.class.remove",
            normalizedArgs as unknown as ActionParams<"node.class.remove">
          );
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "replaceNodeClass") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          if (!normalizedArgs.nodeStart && projectId && currentFileId) {
            const nodeStart = getNodeStart(projectId, currentFileId);
            if (nodeStart) {
              normalizedArgs.nodeStart = nodeStart;
            }
          }
          const result = await executeAction(
            "node.class.replace",
            normalizedArgs as unknown as ActionParams<"node.class.replace">
          );
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "updateNodeClass") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          if (!normalizedArgs.nodeStart && projectId && currentFileId) {
            const nodeStart = getNodeStart(projectId, currentFileId);
            if (nodeStart) {
              normalizedArgs.nodeStart = nodeStart;
            }
          }
          const result = await executeAction(
            "node.class.update",
            normalizedArgs as unknown as ActionParams<"node.class.update">
          );
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "insertNode") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          const result = await executeAction("node.insert", normalizedArgs as unknown as ActionParams<"node.insert">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "insertInstance") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.targetFileId) {
            normalizedArgs.targetFileId = currentFileId;
          }
          const result = await executeAction(
            "instance.insert",
            normalizedArgs as unknown as ActionParams<"instance.insert">
          );
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "deleteNode") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          const result = await executeAction("node.delete", normalizedArgs as unknown as ActionParams<"node.delete">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "moveNodeUp") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          const result = await executeAction("node.move.up", normalizedArgs as unknown as ActionParams<"node.move.up">);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      if (toolName === "moveNodeDown") {
        try {
          const normalizedArgs = { ...(args as Record<string, unknown>) };
          if (projectId && !normalizedArgs.projectId) {
            normalizedArgs.projectId = projectId;
          }
          if (currentFileId && !normalizedArgs.fileId) {
            normalizedArgs.fileId = currentFileId;
          }
          const result = await executeAction(
            "node.move.down",
            normalizedArgs as unknown as ActionParams<"node.move.down">
          );
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: toolName,
          });
        }
      }

      return undefined;
    },
    [projectId, currentFileId, threadId, getNodeStart]
  );

  return { handleToolCall };
}
