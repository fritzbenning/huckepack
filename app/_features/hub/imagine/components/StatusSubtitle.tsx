import { FadeIn } from "@shared/ui-kit/animations/FadeIn";
import { SectionTitle } from "@shared/ui-kit/editor/SectionTitle";
import { AnimatePresence } from "motion/react";

interface StatusSubtitleProps {
  status: "idle" | "inProgress" | "done";
  idle: string;
  inProgress: string;
  done: string;
}

export function StatusSubtitle({ status, idle, inProgress, done }: StatusSubtitleProps) {
  return (
    <AnimatePresence mode="wait">
      {status === "inProgress" ? (
        <FadeIn key="in-progress" className="opacity-80">
          <SectionTitle>{inProgress}</SectionTitle>
        </FadeIn>
      ) : status === "done" ? (
        <FadeIn key="done" className="opacity-80">
          <SectionTitle>{done}</SectionTitle>
        </FadeIn>
      ) : (
        <FadeIn key="idle" className="opacity-80">
          <SectionTitle>{idle}</SectionTitle>
        </FadeIn>
      )}
    </AnimatePresence>
  );
}

