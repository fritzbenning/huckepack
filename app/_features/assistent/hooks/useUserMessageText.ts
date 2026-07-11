import type { UIMessage } from "@convex-dev/agent/react";
import { useMemo } from "react";

export function useUserMessageText(message: UIMessage): string {
  return useMemo(() => {
    const textParts = message.parts.filter(
      (part): part is Extract<typeof part, { type: "text" }> => part.type === "text"
    );

    return (
      textParts.find((part) => {
        const text = part.text || "";
        return !text.startsWith("SelectedNode:") && !text.startsWith("SelectedNodeCode:");
      })?.text || textParts[0]?.text || message.text
    );
  }, [message.parts, message.text]);
}

