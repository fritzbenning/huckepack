import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { type SelectTriggerVariants, selectTriggerVariants } from "./selectTriggerVariants";

export interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement>, Partial<SelectTriggerVariants> {
  isOpen?: boolean;
  placeholder?: string;
  selectedLabel?: string;
  labelClassName?: string;
  hideLabel?: boolean;
  actionIcon?: Icon;
  onActionClick?: () => void;
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      className,
      dimension,
      tone,
      align,
      icon = false,
      isOpen = false,
      placeholder,
      selectedLabel,
      disabled,
      labelClassName,
      hideLabel = false,
      actionIcon: ActionIcon,
      onActionClick,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          "group relative flex items-center gap-1",
          selectTriggerVariants({ dimension, tone, align, icon }),
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...rest}
      >
        {!hideLabel && (
          <span
            className={cn(
              "w-full truncate font-medium",
              !selectedLabel && "font-medium text-neutral-400 dark:text-neutral-500",
              labelClassName
            )}
          >
            {selectedLabel || placeholder}
          </span>
        )}
        <div className="flex items-center gap-1.25">
          <CaretDownIcon
            className={cn("size-2.5 shrink-0 transition-transform", isOpen && "rotate-180")}
            weight="bold"
          />
          {ActionIcon && onActionClick && (
            <div
              className={cn(
                "hidden items-center justify-center",
                "group-hover:pointer-events-auto group-hover:flex",
                "pointer-events-none"
              )}
            >
              <div
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onActionClick();
                  }
                }}
                className="flex cursor-pointer items-center justify-center text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
              >
                <ActionIcon className="size-3.5 shrink-0" weight="regular" />
              </div>
            </div>
          )}
        </div>
      </button>
    );
  }
);

SelectTrigger.displayName = "SelectTrigger";
