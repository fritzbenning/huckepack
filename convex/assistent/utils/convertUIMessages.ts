import type { ModelMessage } from "ai";

/**
 * Converts UIMessage format (from useChat) to ModelMessage format (for streamText).
 *
 * Why this conversion is needed:
 * - useChat sends messages in UIMessage format with a 'parts' array (for UI rendering)
 * - streamText expects ModelMessage format with simple 'content' strings (for LLM)
 * - These are different abstractions: UIMessage is UI-focused, ModelMessage is LLM-focused
 *
 * This function extracts only text content from UIMessage parts and filters out
 * empty messages to ensure compatibility with LLM APIs.
 */
export function convertUIMessagesToModelMessages(
  messages: Array<{
    role: "user" | "assistant" | "system";
    parts?: Array<{ type: string; text?: string }>;
    content?: string | Array<{ type: string; text?: string }>;
  }>
): ModelMessage[] {
  return messages
    .map((msg) => {
      // Handle UIMessage format with 'parts' array
      if (msg.parts && Array.isArray(msg.parts)) {
        const textParts = msg.parts.filter((part) => part.type === "text" && part.text && part.text.trim());
        const content = textParts
          .map((part) => part.text!.trim())
          .join("\n")
          .trim();

        // Skip messages with empty content (they might only have tool calls or other non-text parts)
        if (!content) {
          return null;
        }

        return { role: msg.role, content };
      }

      // Handle legacy format with string content
      if (typeof msg.content === "string") {
        const trimmedContent = msg.content.trim();
        if (!trimmedContent) {
          return null;
        }
        return { role: msg.role, content: trimmedContent };
      }

      // Handle legacy format with content array
      if (Array.isArray(msg.content)) {
        const textParts = msg.content.filter((c) => c.type === "text" && c.text && c.text.trim());
        const content = textParts
          .map((c) => c.text!.trim())
          .join("\n")
          .trim();
        if (!content) {
          return null;
        }
        return {
          role: msg.role,
          content,
        };
      }

      // Skip messages with no content
      return null;
    })
    .filter((msg): msg is ModelMessage => msg !== null);
}
