import { Trash } from "@phosphor-icons/react";
import type React from "react";
import { SectionTitle } from "../SectionTitle";
import { InlineIconButton } from "./InlineIconButton";

interface DesignRuleHeadProps {
  children: React.ReactNode;
  className?: string;
  onDelete: () => void;
}

export function DesignRuleHead({ children, className, onDelete }: DesignRuleHeadProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-t-lg border-neutral-200/50 border-b bg-neutral-100 px-3 py-2.5 uppercase leading-none dark:border-neutral-950/50 dark:bg-neutral-750/50 ${className}`}
    >
      <SectionTitle spacing="none">{children}</SectionTitle>
      <InlineIconButton icon={Trash} onClick={onDelete} title="Delete" className="opacity-0 group-hover:opacity-100" />
    </div>
  );
}
