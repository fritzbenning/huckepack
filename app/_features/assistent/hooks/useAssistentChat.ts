import { useChat } from "@ai-sdk/react";
import type { AIModel } from "@assistent/constants";
import type { Id } from "@convex/_generated/dataModel";
import { useAuthToken } from "@convex-dev/auth/react";
import {
  appendToFileChatThread,
  getFileChatThread,
  updateFileChatThread,
} from "@project/file-manager/stores/fileManagerStore";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef } from "react";
import { useClientTools } from "./useClientTools";

interface UseAssistentChatParams {
  fileId?: Id<"files">;
  threadId?: string;
  projectId?: Id<"projects">;
  currentFileId?: Id<"files">;
  model?: AIModel;
}

export function useAssistentChat({ fileId, threadId, projectId, currentFileId, model }: UseAssistentChatParams) {
  const targetFileId = fileId || currentFileId;
  const token = useAuthToken();
  const firstUserMessageRef = useRef<string | null>(null);

  const { handleToolCall } = useClientTools({
    projectId,
    currentFileId: targetFileId,
    threadId,
  });

  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("Missing VITE_CONVEX_URL environment variable");
  }
  const apiEndpoint = `${convexUrl.replace(".convex.cloud", ".convex.site")}/api/assistent/chat`;

  const chatId = targetFileId && threadId ? `${targetFileId}-${threadId}` : undefined;

  const initialMessages = useMemo(() => {
    if (!targetFileId || !threadId || !projectId) return [];
    const thread = getFileChatThread(targetFileId, threadId, projectId);
    return thread?.messages || [];
  }, [targetFileId, threadId, projectId]);

  const transport = useMemo(() => {
    if (!apiEndpoint) {
      throw new Error("API endpoint is not defined");
    }

    return new DefaultChatTransport({
      api: apiEndpoint,
      fetch: async (url, options) => {
        const headers = new Headers(options?.headers);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", "application/json");

        return fetch(url, {
          ...options,
          headers,
        });
      },
      body: {
        projectId,
        currentFileId: targetFileId,
        model,
      },
    });
  }, [apiEndpoint, projectId, targetFileId, token, model]);

  const chat = useChat({
    id: chatId,
    transport,
    messages: initialMessages,
    onToolCall: async ({ toolCall }) => {
      await handleToolCall({
        toolName: toolCall.toolName,
        args: "input" in toolCall ? toolCall.input : {},
      });
    },
    onFinish: async (result) => {
      if (!targetFileId || !threadId || !projectId) return;

      const threadBefore = getFileChatThread(targetFileId, threadId, projectId);
      const isFirstExchange = threadBefore && threadBefore.messages.length === 0;

      appendToFileChatThread(targetFileId, threadId, result.message, projectId);

      if (isFirstExchange && firstUserMessageRef.current) {
        const textContent = firstUserMessageRef.current
          .replace(/SelectedNode:.*$/m, "")
          .replace(/SelectedNodeCode:.*$/m, "")
          .trim();

        if (textContent) {
          try {
            const titleEndpoint = `${convexUrl.replace(".convex.cloud", ".convex.site")}/api/assistent/getTitle`;
            const headers: HeadersInit = {
              "Content-Type": "application/json",
            };
            if (token) {
              headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(titleEndpoint, {
              method: "POST",
              headers,
              body: JSON.stringify({ text: textContent }),
            }).catch((fetchError) => {
              console.error("Fetch error details:", fetchError);
              throw fetchError;
            });

            if (response.ok) {
              const data = await response.json();
              if (data.title) {
                updateFileChatThread(targetFileId, threadId, { title: data.title }, projectId);
              }
            } else {
              const errorText = await response.text().catch(() => "Unable to read error");
              console.error("Failed to generate title:", response.status, response.statusText, errorText);
            }
          } catch (error) {
            console.error("Failed to generate title:", error);
            if (error instanceof TypeError && error.message === "Failed to fetch") {
              console.error(
                "This is likely a CORS or network error. Check if the endpoint is deployed and accessible."
              );
            }
          }
        }
        firstUserMessageRef.current = null;
      }
    },
  });

  useEffect(() => {
    if (!targetFileId || !threadId || !projectId) return;

    const thread = getFileChatThread(targetFileId, threadId, projectId);
    const messages = thread?.messages || [];

    if (messages.length > 0 && chat.setMessages && chat.messages.length !== messages.length) {
      chat.setMessages(messages);
    }
  }, [threadId, targetFileId, projectId, initialMessages.length]);

  const originalSendMessage = chat.sendMessage;
  const wrappedSendMessage = (...args: Parameters<typeof originalSendMessage>) => {
    if (targetFileId && threadId && projectId) {
      const thread = getFileChatThread(targetFileId, threadId, projectId);
      if (thread && thread.messages.length === 0) {
        const messageArg = args[0];
        if (messageArg && typeof messageArg === "object" && "parts" in messageArg && Array.isArray(messageArg.parts)) {
          const textParts = messageArg.parts
            .filter(
              (p): p is { type: "text"; text: string } => p.type === "text" && "text" in p && typeof p.text === "string"
            )
            .map((p) => p.text)
            .join(" ");
          firstUserMessageRef.current = textParts;
        } else if (
          messageArg &&
          typeof messageArg === "object" &&
          "content" in messageArg &&
          typeof messageArg.content === "string"
        ) {
          firstUserMessageRef.current = messageArg.content;
        }
      }
    }
    return originalSendMessage(...args);
  };

  return {
    ...chat,
    sendMessage: wrappedSendMessage,
  };
}
