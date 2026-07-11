import type { UIMessage } from "ai";
import { AnimatePresence } from "motion/react";
import { ImagineMessagePart } from "./ImagineMessagePart";

interface ImagineAssistantMessageProps {
  message: UIMessage;
  stepStates: Map<string, { stepText: string; status: "in-progress" | "completed" }>;
}

export function ImagineAssistantMessage({ message, stepStates }: ImagineAssistantMessageProps) {
  const parts = message.parts || [];

  return (
    <div className="flex justify-start">
      <div className="flex min-w-0 flex-1 flex-col gap-4 whitespace-normal text-sm text-neutral-850 leading-relaxed dark:text-neutral-200">
        <AnimatePresence initial={false} presenceAffectsLayout={false}>
          {parts.map((part, index) => (
            <ImagineMessagePart
              key={`part-${message.id}-${index}`}
              part={part}
              message={message}
              messageId={message.id}
              index={index}
              stepStates={stepStates}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
