import type { UIMessage } from "ai";
import { AnimatePresence } from "motion/react";
import { AssistantMessagePart } from "./AssistantMessagePart";

export function AssistantMessage({ message }: { message: UIMessage }) {
  const parts = message.parts || [];
  const isStreaming = parts.some(
    (part) => "state" in part && (part.state === "input-streaming" || part.state === "input-available")
  );

  return (
    <div className="flex justify-start">
      <div className="flex min-w-0 flex-1 flex-col gap-4 whitespace-normal text-neutral-850 text-sm leading-relaxed dark:text-neutral-200">
        <AnimatePresence initial={false} presenceAffectsLayout={false}>
          {parts.map((part, index) => (
            <AssistantMessagePart
              key={`part-${message.id}-${index}`}
              part={part}
              messageId={message.id}
              index={index}
              isStreaming={isStreaming}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
