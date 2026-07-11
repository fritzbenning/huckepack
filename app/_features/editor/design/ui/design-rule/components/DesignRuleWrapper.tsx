import { cn } from "@lib/utils";
import { MinusIcon } from "@phosphor-icons/react";
import type React from "react";

export interface DesignRuleWrapperProps {
  title?: string;
  children: React.ReactNode;
  onDelete: () => void;
  className?: string;
}

export function DesignRuleWrapper({ title, children, onDelete, className }: DesignRuleWrapperProps) {
  return (
    <div className={cn("flex items-start gap-2", className)}>
      {title && (
        <div className="flex h-6.5 w-11.5 shrink-0 items-center font-medium text-2xs text-neutral-750 dark:text-neutral-300">
          {title}
        </div>
      )}
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex h-7 items-center">
        <button
          type="button"
          onClick={onDelete}
          className="group shrink-0 rounded-full p-0.75 opacity-60 transition-opacity hover:bg-neutral-100 hover:opacity-100 dark:hover:bg-neutral-750"
          title="Remove design property"
        >
          <MinusIcon className="size-3.5 text-neutral-500 group-hover:text-primary-500 dark:text-neutral-400 dark:group-hover:text-white" />
        </button>
      </div>
    </div>
  );
}
