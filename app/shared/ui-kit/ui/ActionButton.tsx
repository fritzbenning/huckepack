import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: Icon;
  iconSize?: number;
}

export function ActionButton({ children, icon: Icon, iconSize = 14, className, ...props }: ActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center gap-1.25 rounded-full bg-neutral-150 px-2.5 py-1.5 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750",
        className
      )}
      {...props}
    >
      {Icon && <Icon size={iconSize} />}
      <span className="font-medium text-2xs text-neutral-750 dark:text-neutral-300">{children}</span>
    </button>
  );
}
