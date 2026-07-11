import type { AIModel } from "@assistent/constants";
import type { Id } from "@convex/_generated/dataModel";
import { cn } from "@lib/utils";
import { FadeIn } from "@shared/ui-kit/animations/FadeIn";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence } from "motion/react";
import type React from "react";
import { useState } from "react";
import { useNodeAttachment } from "../hooks/useNodeAttachment";
import { Attachment } from "./Attachment";
import { MessageInput } from "./MessageInput";
import { MessageInputBoxFooter } from "./MessageInputBoxFooter";

const messageInputBoxVariants = cva("relative z-20 flex w-full flex-col", {
  variants: {
    size: {
      default:
        "gap-1 rounded-lg border border-neutral-150 bg-neutral-100 px-2.5 py-2.5 dark:border-neutral-750 dark:bg-neutral-800",
      large:
        "gap-3 rounded-2xl border-1 border-white bg-white/80 px-5 py-5 shadow-2xl/16 dark:border-neutral-600 dark:bg-neutral-750/80",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface MessageInputBoxProps extends VariantProps<typeof messageInputBoxVariants> {
  threadId?: string;
  status?: "loading" | "idle" | "error" | "submitted" | "streaming" | "ready";
  projectId?: Id<"projects">;
  fileId?: Id<"files">;
  onSend?: (prompt: string, selectedNode?: string | null, selectedNodeCode?: string | null) => void;
  selectedModel?: AIModel;
  setSelectedModel?: (model: AIModel) => void;
  placeholder?: string;
}

export const MessageInputBox: React.FC<MessageInputBoxProps> = ({
  status = "ready",
  projectId,
  fileId,
  onSend,
  selectedModel,
  setSelectedModel,
  placeholder,
  size = "default",
}) => {
  const isStreaming = status === "streaming";
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { selectedNode, selectedNodeCode, selectedNodeTitle, handleDetachNode } = useNodeAttachment(projectId, fileId);

  const handleSend = () => {
    const prompt = message.trim();
    if (!prompt || isLoading) return;

    if (!onSend) return;

    setIsLoading(true);
    setMessage("");
    onSend(prompt, selectedNode, selectedNodeCode);
    setIsLoading(false);
  };

  return (
    <div className={cn(size === "large" ? "px-0 pb-0" : "px-1.5 pb-1.5")}>
      <div className="relative z-0">
        <div className={cn(messageInputBoxVariants({ size }))}>
          {selectedNode && selectedNodeTitle && <Attachment title={selectedNodeTitle} onDetach={handleDetachNode} />}
          <MessageInput
            message={message}
            setMessage={setMessage}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            isLoading={isLoading}
            size={size ?? "default"}
            placeholder={placeholder}
          />
          <MessageInputBoxFooter
            size={size}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isLoading={isLoading}
            message={message}
            isStreaming={isStreaming}
            onSend={handleSend}
          />
        </div>
        <AnimatePresence>
          {isStreaming && (
            <FadeIn className="-top-6 absolute left-0 z-0 w-full rounded-t-lg border border-neutral-200 bg-neutral-50 px-2 pt-1.25 pb-2.5 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
              <span className="animate-pulse text-xs">Generating ...</span>
            </FadeIn>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
