import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { IconAction } from "@shared/ui-kit/ui/IconAction";
import type React from "react";

export interface ModalHeaderProps {
  title?: string;
  icon?: Icon;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ModalHeader({
  title,
  icon: Icon,
  onClose,
  showCloseButton = true,
  className,
  children,
}: ModalHeaderProps) {
  if (!title && !Icon && !showCloseButton && !children) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between border-neutral-100 border-b px-4 py-3 text-neutral-950 dark:border-neutral-750 dark:text-neutral-100",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4" weight="duotone" />}
        {title && <h3 className="font-semibold text-xs">{title}</h3>}
        {children}
      </div>
      {showCloseButton && onClose && <IconAction onClick={onClose} size="md" />}
    </div>
  );
}
