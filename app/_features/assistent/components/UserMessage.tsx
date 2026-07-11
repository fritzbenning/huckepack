import { FadeIn } from "@shared/ui-kit/animations/FadeIn";
import type { UIMessage } from "ai";
import { cva } from "class-variance-authority";
import { AnimatePresence } from "motion/react";
import { MarkdownText } from "./MarkdownText";

const messageBubbleVariants = cva(
  "flex min-w-0 flex-1 flex-col gap-2.5 whitespace-normal rounded-md border border-neutral-150 bg-neutral-100 px-3 py-1 font-medium text-sm text-neutral-950 leading-relaxed dark:border-neutral-750 dark:bg-neutral-800 dark:text-neutral-100",
  {
    variants: {
      status: {
        streaming: "bg-green-100 dark:bg-green-900/30",
        failed: "bg-red-100 dark:bg-red-900/30",
        default: "",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);

export function UserMessage({ message }: { message: UIMessage }) {
  const parts = message.parts || [];
  const textParts = parts.filter((part): part is { type: "text"; text: string } => part.type === "text");
  // Only show the first text part (user's actual message), hide SelectedNode metadata
  const content = textParts[0]?.text || "";
  const status = "default";

  return (
    <div className="flex justify-end">
      <div className={messageBubbleVariants({ status })}>
        <AnimatePresence mode="wait" initial={false} presenceAffectsLayout={false}>
          {content && (
            <FadeIn key="markdown" className="flex flex-col gap-2.5">
              <MarkdownText content={content} />
            </FadeIn>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
