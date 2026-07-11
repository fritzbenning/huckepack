import { cn } from "@lib/utils";
import type React from "react";
import { useEffect, useRef } from "react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  size?: "default" | "large";
  placeholder?: string;
}

export const MessageInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  onKeyPress,
  isLoading,
  size = "default",
  placeholder = "Ask to modify design ...",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!message && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message]);

  return (
    <textarea
      ref={textareaRef}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      className={cn(
        "w-full resize-none overflow-y-auto border-0 p-0 focus:outline-none dark:text-white",
        size === "default" ? "max-h-[100px] min-h-10 text-sm" : "max-h-[200px] min-h-16 text-base",
      )}
      disabled={isLoading}
      rows={size === "large" ? 3 : 1}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = "auto";
        target.style.height = `${Math.min(target.scrollHeight, size === "large" ? 300 : 200)}px`;
      }}
    />
  );
};
