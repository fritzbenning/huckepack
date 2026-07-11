import type { AIModel } from "@assistent/constants";
import type { Id } from "@convex/_generated/dataModel";
import { cn } from "@lib/utils";
import { useState } from "react";
import { useAssistentChat } from "../hooks/useAssistentChat";
import { MessageInputBox } from "./MessageInputBox";
import MessageList from "./MessageList";

export default function ThreadView({
  threadId,
  projectId,
  currentFileId,
}: {
  threadId: string;
  projectId?: Id<"projects">;
  currentFileId?: Id<"files">;
}) {
  const [selectedModel, setSelectedModel] = useState<AIModel>("anthropic/claude-haiku-4.5");

  const { messages, status, sendMessage } = useAssistentChat({
    fileId: currentFileId,
    threadId,
    projectId,
    currentFileId,
    model: selectedModel,
  });

  const handleSendMessage = (prompt: string, selectedNode?: string | null, selectedNodeCode?: string | null) => {
    const parts: Array<{ type: "text"; text: string }> = [{ type: "text", text: prompt }];

    if (selectedNode) {
      parts.push({ type: "text", text: `SelectedNode: ${selectedNode}` });
    }

    if (selectedNodeCode) {
      parts.push({ type: "text", text: `SelectedNodeCode: ${selectedNodeCode}` });
    }

    sendMessage({
      parts,
    } as { parts: Array<{ type: "text"; text: string }> });
  };

  const isGenerating = status === "streaming";

  return (
    <div
      className={cn(
        "grid min-h-0 min-w-0 grid-rows-[1fr_auto]",
        "animate-colorful-glow",
        isGenerating && "animate-colorful-glow-active"
      )}
    >
      <MessageList messages={messages} status={status} />
      <MessageInputBox
        threadId={threadId}
        status={status}
        projectId={projectId}
        fileId={currentFileId}
        onSend={handleSendMessage}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </div>
  );
}
