import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";

export interface IdlePlaceholderProps {
  icon: Icon;
  label: string;
  className?: string;
}

function IdlePlaceholder({ icon: Icon, label, className }: IdlePlaceholderProps) {
  return (
    <div className={cn("flex h-full w-full flex-col items-center justify-center gap-4 text-neutral-400", className)}>
      <Icon className="size-8" weight="light" />
      <span className="max-w-40 text-center font-medium text-sm">{label}</span>
    </div>
  );
}

export default IdlePlaceholder;
