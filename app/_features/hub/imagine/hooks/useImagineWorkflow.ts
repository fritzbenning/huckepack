import { useChat } from "@ai-sdk/react";
import type { Id } from "@convex/_generated/dataModel";
import { useAuthToken } from "@convex-dev/auth/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";

interface StepStatus {
  stepText: string;
  status: "in-progress" | "completed";
}

interface UseImagineWorkflowParams {
  teamId?: Id<"teams">;
}

export function useImagineWorkflow({ teamId }: UseImagineWorkflowParams = {}) {
  const token = useAuthToken();

  const teamIdRef = useRef(teamId);

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [stepStates, setStepStates] = useState<Map<string, StepStatus>>(new Map());

  useEffect(() => {
    teamIdRef.current = teamId;
  }, [teamId]);

  const convexUrl = import.meta.env.VITE_CONVEX_URL;

  if (!convexUrl) {
    throw new Error("Missing VITE_CONVEX_URL environment variable");
  }

  const apiEndpoint = `${convexUrl.replace(".convex.cloud", ".convex.site")}/api/assistent/imagine`;

  const transport = useMemo(() => {
    if (!apiEndpoint) {
      throw new Error("API endpoint is not defined");
    }

    return new DefaultChatTransport({
      api: apiEndpoint,
      fetch: async (url, options) => {
        const currentTeamId = teamIdRef.current;

        if (!currentTeamId) {
          console.error("[useImagineWorkflow] teamId is not available:", currentTeamId);
          throw new Error("teamId is required but not available");
        }

        const headers = new Headers(options?.headers);

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        headers.set("Content-Type", "application/json");

        let requestBody = options?.body;

        if (requestBody && typeof requestBody === "string") {
          try {
            const parsedBody = JSON.parse(requestBody);
            parsedBody.teamId = currentTeamId;
            requestBody = JSON.stringify(parsedBody);
          } catch (e) {
            console.error("[useImagineWorkflow] Failed to parse request body:", e);
          }
        }

        try {
          const response = await fetch(url, {
            ...options,
            headers,
            body: requestBody,
          });

          if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            console.error("[useImagineWorkflow] Fetch error:", response.status, response.statusText, errorText);
          }

          return response;
        } catch (error) {
          console.error("[useImagineWorkflow] Fetch failed:", error);
          throw error;
        }
      },
    });
  }, [apiEndpoint, token, teamId]);

  const chat = useChat({
    transport,
    onError: (error) => {
      console.error("[useImagineWorkflow] Error:", error);
    },
  });

  // Track step states, projectId, and projectName from message parts and data
  useEffect(() => {
    const newStepStates = new Map<string, StepStatus>();
    let foundProjectId: string | null = null;
    let foundProjectName: string | null = null;

    // Extract step status, projectId, and projectName from all messages' parts and data
    chat.messages.forEach((message) => {
      // Check message parts for data-step and data-meta
      if (message.parts && Array.isArray(message.parts)) {
        message.parts.forEach((part) => {
          if (part.type === "data-step") {
            const dataStepPart = part as {
              type: "data-step";
              data: { stepText: string; status: "in-progress" | "completed" };
            };
            const { stepText, status } = dataStepPart.data;
            newStepStates.set(stepText, { stepText, status });
          }
          if (part.type === "data-meta") {
            const dataMetaPart = part as { type: "data-meta"; data: { projectId?: string; projectName?: string } };
            if (dataMetaPart.data?.projectId) {
              foundProjectId = dataMetaPart.data.projectId;
            }
            if (dataMetaPart.data?.projectName) {
              foundProjectName = dataMetaPart.data.projectName;
            }
          }
        });
      }
    });

    setStepStates(newStepStates);
    if (foundProjectId) {
      setProjectId(foundProjectId);
    }
    if (foundProjectName) {
      setProjectName(foundProjectName);
    }
  }, [chat.messages]);

  const workflowStatus = useMemo(() => {
    const isStreaming = chat.status === "submitted" || (chat.status as string) === "streaming";

    if (isStreaming) {
      return "inProgress";
    }

    if (chat.messages.length > 0 && projectName) {
      return "done";
    }

    if (chat.messages.length > 0 && !projectName) {
      return "pending";
    }

    return "idle";
  }, [chat.status, chat.messages.length, projectName]);

  return {
    ...chat,
    projectId,
    projectName,
    stepStates,
    workflowStatus,
  };
}
