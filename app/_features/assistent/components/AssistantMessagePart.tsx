import { FadeIn } from "@shared/ui-kit/animations/FadeIn";
import type { UIMessage } from "ai";
import type { DynamicToolPart, ToolPart } from "../types";
import { DesignTokenStack } from "./DesignTokenStack";
import { MarkdownText } from "./MarkdownText";
import { Reasoning } from "./Reasoning";
import { ToolIndicator } from "./ToolIndicator";

interface AssistantMessagePartProps {
  part: UIMessage["parts"][number];
  messageId: string;
  index: number;
  isStreaming?: boolean;
}

export function AssistantMessagePart({
  part,
  messageId,
  index,
  isStreaming: _isStreaming = false,
}: AssistantMessagePartProps) {
  if (part.type === "step-start") {
    return null;
  }

  if (part.type === "text" && part.text) {
    return (
      <FadeIn key={`text-${messageId}-${index}`} className="flex flex-col gap-2.5">
        <MarkdownText content={part.text} />
      </FadeIn>
    );
  }

  if (part.type === "reasoning" && part.text) {
    const reasoningPart = part as { state?: string };
    return (
      <FadeIn key={`text-${messageId}-${index}`} className="flex flex-col gap-2.5">
        <Reasoning content={part.text} state={reasoningPart.state} />
      </FadeIn>
    );
  }

  if (typeof part.type === "string" && (part.type.startsWith("tool-") || part.type === "dynamic-tool")) {
    let toolName: string;
    let state: string;
    let result: unknown;
    let input: unknown;
    let toolCallId: string | undefined;

    const partWithInput = part as { input?: unknown };
    input = partWithInput.input;

    if (part.type === "dynamic-tool") {
      const dynamicPart = part as DynamicToolPart;
      toolName = dynamicPart.toolName;
      toolCallId = dynamicPart.toolCallId;
      state = dynamicPart.state;
      result = dynamicPart.output;
    } else {
      const toolPart = part as ToolPart;
      toolName = toolPart.type.replace("tool-", "");
      toolCallId = toolPart.toolCallId;
      state = toolPart.state;
      result = toolPart.output;
    }

    return (
      <FadeIn key={`tool-${messageId}-${toolCallId || index}`} className="flex min-w-0 flex-col gap-1">
        {toolName === "displayDesignTokens" && state === "output-available" && input != null && (
          <DesignTokenStack
            tokens={(() => {
              try {
                if (typeof input === "object" && input !== null && "tokens" in input) {
                  const tokens = (input as { tokens: unknown }).tokens;
                  return Array.isArray(tokens) ? tokens : [];
                }
                if (Array.isArray(input)) {
                  return input;
                }
                return [];
              } catch {
                return [];
              }
            })()}
          />
        )}
        {toolName !== "displayDesignTokens" && (
          <ToolIndicator
            name={toolName}
            output={typeof result === "string" ? result : String(result ?? "")}
            state={
              state === "output-available"
                ? "output-available"
                : state === "input-streaming" || state === "input-available"
                  ? "input-streaming"
                  : "output-error"
            }
          />
        )}
      </FadeIn>
    );
  }

  return null;
}
