import type { Id } from "@convex/_generated/dataModel";
import { useCallback, useState } from "react";

type ActiveAgent = "composer" | "coder";

interface AgentHandoffState {
  activeAgent: ActiveAgent;
  coderContext?: {
    fileId: Id<"files">;
    instruction: string;
    tailwindTheme?: string;
    recentContext?: Array<{ role: "user" | "assistant"; content: string }>;
  };
}

export function useAgentHandoff() {
  const [state, setState] = useState<AgentHandoffState>({
    activeAgent: "composer",
  });

  const switchToCoder = useCallback(
    (context: {
      fileId: Id<"files">;
      instruction: string;
      tailwindTheme?: string;
      recentContext?: Array<{ role: "user" | "assistant"; content: string }>;
    }) => {
      setState({
        activeAgent: "coder",
        coderContext: context,
      });
    },
    []
  );

  const switchToComposer = useCallback(() => {
    setState({
      activeAgent: "composer",
      coderContext: undefined,
    });
  }, []);

  const getApiEndpoint = useCallback((): string => {
    const convexUrl = import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("Missing VITE_CONVEX_URL environment variable");
    }
    const endpoint = state.activeAgent === "composer" ? "/api/assistent/composer" : "/api/assistent/coder";
    return `${convexUrl}${endpoint}`;
  }, [state.activeAgent]);

  return {
    activeAgent: state.activeAgent,
    coderContext: state.coderContext,
    switchToCoder,
    switchToComposer,
    getApiEndpoint,
  };
}
