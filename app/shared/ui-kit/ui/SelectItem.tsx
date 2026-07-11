import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type React from "react";
import type { DynamicIconName } from "@/types/componentTypes";

const selectItemVariants = cva(
  "block w-full cursor-pointer rounded-sm px-3 py-1.25 text-left font-medium text-2xs focus:outline-none",
  {
    variants: {
      selected: {
        true: "bg-neutral-200 bg-neutral-500 text-white dark:bg-neutral-800",
        false: "text-neutral-400 hover:bg-neutral-650 hover:text-white dark:hover:bg-neutral-900",
      },
      highlighted: {
        true: "bg-neutral-850",
        false: "",
      },
    },
    defaultVariants: {
      selected: false,
      highlighted: false,
    },
  }
);

export interface SelectItemProps {
  value: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
  highlighted?: boolean;
  onClick: (value: string) => void;
  className?: string;
  // Icon support - can use either approach
  icon?: Icon;
  iconName?: DynamicIconName;
  iconClassName?: string;
  id?: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  label,
  disabled = false,
  selected = false,
  highlighted = false,
  onClick,
  className = "",
  icon: IconComponent,
  iconName,
  iconClassName = "",
  id,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  const renderIcon = () => {
    if (IconComponent) {
      return <IconComponent className={cn("size-3 shrink-0", iconClassName)} weight="duotone" aria-hidden="true" />;
    }
    if (iconName) {
      // Note: Dynamic icon support removed - use icon prop instead
      return null;
    }
    return null;
  };

  return (
    <button
      type="button"
      id={id}
      role="option"
      aria-selected={selected}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        selectItemVariants({ selected, highlighted }),
        disabled && "cursor-not-allowed opacity-50",
        IconComponent || iconName ? "flex items-center gap-2" : "",
        className
      )}
    >
      {renderIcon()}
      {label}
    </button>
  );
};
