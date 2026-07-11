import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import Button from "@shared/ui-kit/ui/Button";
import type React from "react";
import { useEffect } from "react";

export interface ModalAction {
  action: () => void;
  label: React.ReactNode;
  icon?: Icon;
  disabled?: boolean;
  severity?: "primary" | "secondary" | "error";
  variant?: "solid" | "outline";
}

export interface ModalFooterProps {
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  children?: React.ReactNode;
  className?: string;
}

export function ModalFooter({ primaryAction, secondaryAction, children, className }: ModalFooterProps) {
  useEffect(() => {
    if (!primaryAction) return;

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA" ||
          activeElement?.getAttribute("contenteditable") === "true";

        if (!isInputFocused && !primaryAction.disabled) {
          e.preventDefault();
          primaryAction.action();
        }
      }
    };

    document.addEventListener("keydown", handleEnter);
    return () => document.removeEventListener("keydown", handleEnter);
  }, [primaryAction]);

  return (
    <div className={cn("flex justify-end gap-2 rounded-b-lg bg-neutral-100 px-5 py-3 dark:bg-neutral-900", className)}>
      {children}
      <div className="flex items-center gap-2">
        {secondaryAction && (
          <Button
            onClick={secondaryAction.action}
            variant={secondaryAction.variant || "outline"}
            size="large"
            disabled={secondaryAction.disabled}
            icon={secondaryAction.icon}
            severity={secondaryAction.severity || "primary"}
          >
            {secondaryAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button
            onClick={primaryAction.action}
            variant={primaryAction.variant || "solid"}
            size="large"
            disabled={primaryAction.disabled}
            icon={primaryAction.icon}
            severity={primaryAction.severity || "primary"}
          >
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
