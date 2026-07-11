import { MarkdownText } from "@assistent/components/MarkdownText";
import { cn } from "@lib/utils";
import { CaretDown, CheckIcon } from "@phosphor-icons/react";
import { FadeIn } from "@shared/ui-kit/animations/FadeIn";
import { Spinner } from "@shared/ui-kit/ui/Spinner";
import { useState } from "react";

interface StepItemProps {
  stepId: string;
  stepText: string;
  status: "in-progress" | "completed";
  output?: string;
}

export function StepItem({ stepId, stepText, status, output }: StepItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasOutput = output !== undefined && output.length > 0;

  return (
    <FadeIn className="flex flex-col rounded-lg bg-white/75 shadow-lg/4 ring-2 ring-primary-500/8 backdrop-blur-xl dark:bg-black/50 dark:ring-black/8">
      <div className="flex items-center gap-2 px-4 py-3.5">
        {status === "in-progress" ? (
          <Spinner size="sm" />
        ) : (
          <CheckIcon className="size-4 text-neutral-500" weight="bold" />
        )}
        <span className="flex-1 font-medium text-base text-neutral-600 dark:text-neutral-400">{stepText}</span>
        {hasOutput && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center rounded-full bg-black/6 p-1 transition-colors hover:bg-black hover:text-white dark:bg-white/8 dark:hover:bg-white dark:hover:text-black"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse output" : "Expand output"}
          >
            <CaretDown
              className={cn("size-2.5 transition-transform duration-200", isExpanded && "rotate-180")}
              weight="bold"
            />
          </button>
        )}
      </div>
      {hasOutput && isExpanded && (
        <div className="border-black/8 border-t px-5 py-4 text-sm text-neutral-600 leading-loose dark:border-white/12 dark:text-neutral-400">
          <MarkdownText content={output} />
        </div>
      )}
    </FadeIn>
  );
}
