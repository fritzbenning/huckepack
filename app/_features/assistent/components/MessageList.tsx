import { ChatCircleDotsIcon } from "@phosphor-icons/react";
import IdlePlaceholder from "@shared/ui-kit/ui/IdlePlaceholder";
import type { UIMessage } from "ai";
import { Activity, useEffect, useEffectEvent, useRef } from "react";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { AssistantMessage } from "./AssistantMessage";
import { Thinking } from "./Thinking";
import { UserMessage } from "./UserMessage";

interface MessageListProps {
  messages: UIMessage[];
  status: "loading" | "idle" | "error" | "submitted" | "streaming" | "ready";
}

export default function MessageList({ messages, status }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isStreaming = status === "streaming";
  const { scrollRef, handleScroll } = useAutoScroll({
    isStreaming,
    content: messages.length.toString(),
  });

  const scrollToBottom = useEffectEvent(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: isStreaming ? "smooth" : "auto" });
  });

  useEffect(() => {
    scrollToBottom();
    console.log("messages", messages);
  }, [messages, scrollToBottom]);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="relative flex min-h-0 min-w-0 flex-col overflow-y-auto px-3.5 pt-3.5 pb-7"
    >
      <Activity mode={messages.length > 0 ? "visible" : "hidden"}>
        <div className="flex min-w-0 flex-col gap-4 whitespace-normal">
          {messages.map((message, index) => {
            return message.role === "user" ? (
              <UserMessage key={message.id || `msg-${index}`} message={message} />
            ) : (
              <AssistantMessage key={message.id || `msg-${index}`} message={message} />
            );
          })}
          {status === "submitted" && <Thinking isThinking={true} />}
          <div ref={messagesEndRef} />
        </div>
      </Activity>
      <Activity mode={messages.length === 0 ? "visible" : "hidden"}>
        <IdlePlaceholder icon={ChatCircleDotsIcon} label="How can I assist you?" />
      </Activity>
    </div>
  );
}
