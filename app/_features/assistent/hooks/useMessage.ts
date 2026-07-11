import { type UIMessage, useSmoothText } from "@convex-dev/agent/react";

export function useMessage(message: UIMessage) {
  const isUser = message.role === "user";

  const reasoningParts = message.parts.filter((p) => p.type === "reasoning");

  const [reasoningText] = useSmoothText(
    reasoningParts
      .map((p) => p.text)
      .filter(Boolean)
      .join("\n"),
    {
      startStreaming: message.status === "streaming",
    }
  );

  return {
    isUser,
    reasoningText,
  };
}
