import { cn } from "@lib/utils";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

interface ExpandableHeaderProps {
  isExpanded: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function ExpandableHeader({ isExpanded, onClick, children }: ExpandableHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("flex w-full items-center gap-2 px-3 py-2 transition-colors", !isExpanded && "rounded-t-lg")}
    >
      <span className="flex flex-1 justify-between font-mono text-2xs">{children}</span>
      {isExpanded ? (
        <CaretUp className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" weight="regular" />
      ) : (
        <CaretDown className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" weight="regular" />
      )}
    </button>
  );
}

