export interface ChatMessage {
  role: "user" | "assistant" | "system";
  parts?: Array<{ type: string; text?: string }>;
  content?: string | Array<{ type: string; text?: string }>;
}

export function extractPromptFromRequest(body: unknown): string | undefined {
  if (typeof body === "object" && body !== null && "messages" in body && Array.isArray(body.messages)) {
    const messages = body.messages as ChatMessage[];
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop();

    if (!lastUserMessage) return undefined;

    if (lastUserMessage.parts && Array.isArray(lastUserMessage.parts)) {
      const textParts = lastUserMessage.parts
        .filter((part) => part.type === "text" && part.text)
        .map((part) => part.text!);
      return textParts.join(" ").trim();
    }

    if (typeof lastUserMessage.content === "string") {
      return lastUserMessage.content.trim();
    }

    if (Array.isArray(lastUserMessage.content)) {
      const textParts = lastUserMessage.content.filter((c) => c.type === "text" && c.text).map((c) => c.text!);
      return textParts.join(" ").trim();
    }
  }

  if (typeof body === "object" && body !== null && "prompt" in body && typeof body.prompt === "string") {
    return body.prompt;
  }

  return undefined;
}
