import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { Check, PlusIcon, X } from "@phosphor-icons/react";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { InputField } from "@shared/ui-kit/inputs/input/InputField";
import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";

const sectionTitleVariants = cva("flex items-center justify-between font-bold text-4xs uppercase tracking-wide", {
  variants: {
    variant: {
      default: "text-neutral-450 dark:text-neutral-400",
      highlight: "text-primary-500 dark:text-primary-400",
    },
    spacing: {
      default: "mb-1.5",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    spacing: "default",
  },
});

interface SectionTitleProps extends VariantProps<typeof sectionTitleVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  actionIcon?: Icon;
  editable?: boolean;
  onRename?: (newName: string) => void;
  actionButtonRef?: React.RefObject<HTMLButtonElement | null>;
  normalCase?: boolean;
}

export function SectionTitle({
  children,
  className,
  variant,
  spacing,
  onClick,
  actionIcon: ActionIcon = PlusIcon,
  editable = false,
  onRename,
  actionButtonRef,
  normalCase = false,
}: SectionTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(typeof children === "string" ? children : "");

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(typeof children === "string" ? children : "");
  };

  const handleSave = () => {
    if (onRename && editValue.trim() && editValue.trim() !== (typeof children === "string" ? children : "")) {
      onRename(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(typeof children === "string" ? children : "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      handleCancel();
    }
  };

  if (editable && isEditing) {
    return (
      <div className={cn(sectionTitleVariants({ variant, spacing }), className, "normal-case")}>
        <div className="flex flex-1 items-center gap-1">
          <InputField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleCancel}
            onFocus={(e) => e.target.select()}
            dimension="small"
            tone="transparent"
            className="flex-1 text-3xs normal-case"
            autoFocus
          />
        </div>
        <div className="flex items-center gap-1.5">
          <InlineIconButton icon={Check} onClick={handleSave} title="Save" weight="regular" />
          <InlineIconButton icon={X} onClick={handleCancel} title="Cancel" weight="regular" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(sectionTitleVariants({ variant, spacing }), className, (editable || normalCase) && "normal-case")}
    >
      <div className="flex items-center gap-1">
        {editable ? (
          <button
            type="button"
            onClick={handleEdit}
            className="text-3xs text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-450 dark:hover:text-neutral-300"
          >
            {children}
          </button>
        ) : (
          children
        )}
      </div>
      {onClick && (
        <button
          ref={actionButtonRef}
          type="button"
          onClick={onClick}
          className="group rounded-full p-0.75 opacity-60 transition-opacity hover:bg-neutral-100 hover:opacity-100 dark:hover:bg-neutral-750"
        >
          <ActionIcon className="size-3.5 text-neutral-600 group-hover:text-primary-500 dark:text-neutral-400 dark:group-hover:text-white" />
        </button>
      )}
    </div>
  );
}
