import { BrainIcon } from "@phosphor-icons/react";
import { FadeIn } from "@shared/ui-kit/animations/FadeIn";
import { DotsSpinner } from "@shared/ui-kit/ui/spinners/DotsSpinner";
import { formatDuration } from "@shared/utils/format";
import { AnimatePresence } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface ThinkingProps {
  isThinking: boolean;
}

export const Thinking: React.FC<ThinkingProps> = ({ isThinking }) => {
  const [duration, setDuration] = useState<number | null>(0);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isThinking) {
      startTimeRef.current = Date.now();
      setDuration(0);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else if (startTimeRef.current !== null) {
      const elapsed = Date.now() - startTimeRef.current;
      setDuration(elapsed);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isThinking]);

  return (
    <AnimatePresence mode="wait">
      {isThinking ? (
        <FadeIn key="thinking" className="flex justify-start">
          <div className="flex items-center gap-2">
            <DotsSpinner size="sm" />
            {/* <span className="text-xs text-neutral-400 dark:text-neutral-500">Thinking...</span> */}
          </div>
        </FadeIn>
      ) : (
        <FadeIn
          key="duration"
          className="flex items-center justify-start gap-1 text-neutral-400 text-xs dark:text-neutral-500"
        >
          <BrainIcon className="size-3" /> Thought for {formatDuration(duration ?? 0)}
        </FadeIn>
      )}
    </AnimatePresence>
  );
};
