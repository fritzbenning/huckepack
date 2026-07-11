import { cn } from "@lib/utils";
import { CaretRight } from "@phosphor-icons/react";
import { AnimatedExpandable } from "@shared/ui-kit/animations/AnimatedExpandable";
import type React from "react";
import { useState } from "react";
import { Streamdown } from "streamdown";
import { useReasoningDuration } from "../hooks/useReasoningDuration";

interface ReasoningProps {
  content: string;
  state?: string;
}

export function Reasoning({ content, state }: ReasoningProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isDone = state === "done";
  const isStreaming = !isDone && content.length > 0;
  const showContent = isStreaming || isExpanded;

  const elapsedSeconds = useReasoningDuration(content, isDone);

  const handleToggle = () => {
    if (isDone) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleToggle}
        className="group flex w-fit cursor-pointer items-center gap-1 font-semibold text-2xs text-neutral-500 leading-none transition-colors hover:text-neutral-400 disabled:cursor-default disabled:hover:text-neutral-500"
        disabled={isStreaming}
      >
        <CaretRight
          className={cn("size-2.5 transition-transform duration-200", showContent ? "rotate-90" : "rotate-0")}
          weight="bold"
        />
        <span>
          {isStreaming ? "Thinking..." : elapsedSeconds === 0 ? "Thought" : `Thought for ${elapsedSeconds} sec`}
        </span>
      </button>
      <AnimatedExpandable
        isOpen={showContent}
        contentClassName="pt-2 text-2xs text-neutral-500"
        maxHeight={`${Math.max(100, content.length * 1.25)}px`}
      >
        <Streamdown
          isAnimating={isStreaming}
          components={{
            p: ({ children }) => <p className="mb-1.5 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="mb-1.5 flex list-inside list-disc flex-col gap-1">{children}</ul>,
            li: ({ children }) => <li className="flex items-center gap-1">{children}</li>,
            code: ({ children, ...props }: React.ComponentPropsWithoutRef<"code">) => (
              <code className="rounded bg-neutral-100 px-1 py-0.5 text-3xs dark:bg-neutral-900" {...props}>
                {children}
              </code>
            ),
            pre: ({ children, ...props }: React.ComponentPropsWithoutRef<"pre">) => (
              <pre
                className="overflow-x-auto rounded-md bg-neutral-100 px-2 py-1 text-3xs dark:bg-neutral-900"
                {...props}
              >
                {children}
              </pre>
            ),
          }}
        >
          {content}
        </Streamdown>
      </AnimatedExpandable>
    </div>
  );
}
