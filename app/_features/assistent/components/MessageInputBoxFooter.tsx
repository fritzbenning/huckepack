import type { AIModel } from "@assistent/constants";
import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { ModelSelector } from "./ModelSelector";
import { SendButton } from "./SendButton";

const messageInputBoxFooterVariants = cva("flex items-end justify-between", {
  variants: {
    size: {
      default: "gap-1.5",
      large: "gap-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const modelInfoVariants = cva("flex items-start gap-1.5 text-neutral-750 dark:text-neutral-300", {
  variants: {
    size: {
      default: "text-2xs",
      large: "text-xs",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface MessageInputBoxFooterProps extends VariantProps<typeof messageInputBoxFooterVariants> {
  selectedModel?: AIModel;
  setSelectedModel?: (model: AIModel) => void;
  isLoading: boolean;
  message: string;
  isStreaming: boolean;
  onSend: () => void;
}

export const MessageInputBoxFooter: React.FC<MessageInputBoxFooterProps> = ({
  size = "default",
  selectedModel,
  setSelectedModel,
  isLoading,
  message,
  isStreaming,
  onSend,
}) => {
  return (
    <footer className={cn(messageInputBoxFooterVariants({ size }))}>
      <div className={modelInfoVariants({ size })}>
        {selectedModel && setSelectedModel ? (
          <ModelSelector
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isLoading={isLoading}
            y="top"
          />
        ) : (
          "Gemini 3 Flash"
        )}
      </div>
      <SendButton onClick={onSend} disabled={!message.trim() || isLoading || isStreaming} size={size ?? undefined} />
    </footer>
  );
};
