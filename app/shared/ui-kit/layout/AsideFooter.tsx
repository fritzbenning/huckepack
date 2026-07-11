import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { IconAction } from "@shared/ui-kit/ui/IconAction";
import type { ReactNode, RefObject } from "react";

interface AsideFooterProps {
  children: ReactNode;
  icon?: Icon;
  onIconClick?: () => void;
  iconRef?: RefObject<HTMLButtonElement | null>;
  className?: string;
}

export function AsideFooter({ children, icon, onIconClick, iconRef, className }: AsideFooterProps) {
  return (
    <footer
      className={cn(
        "sticky bottom-0 flex justify-between border-neutral-150/75 border-t bg-neutral-50 px-3.5 py-2.5 dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      {children}
      {icon && onIconClick && <IconAction ref={iconRef} icon={icon} onClick={onIconClick} size="md" weight="light" />}
    </footer>
  );
}
