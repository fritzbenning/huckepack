import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type React from "react";
import { SelectItem } from "./SelectItem";

export const selectContentVariants = cva(
  "flex flex-col gap-0.75 rounded-md bg-black/90 p-0.75 shadow-lg/12 backdrop-blur-md",
  {
    variants: {
      size: {
        tiny: "min-w-17",
        small: "min-w-18",
        medium: "w-full min-w-40",
        large: "w-full min-w-40",
      },
    },
    defaultVariants: {
      size: "small",
    },
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: Icon;
}

export interface SelectListProps {
  options: SelectOption[];
  value?: string | null;
  onSelect: (value: string) => void;
  size?: "tiny" | "small" | "medium" | "large";
  contentClassName?: string;
  itemClassName?: string;
  iconClassName?: string;
  highlightedIndex?: number;
}

export const SelectList: React.FC<SelectListProps> = ({
  options,
  value,
  onSelect,
  size = "small",
  contentClassName = "",
  itemClassName = "",
  iconClassName = "",
  highlightedIndex = -1,
}) => {
  return (
    <div className={cn(selectContentVariants({ size }), "scroll-p-2", contentClassName)}>
      {options.map((option, index) => (
        <SelectItem
          key={`${option.value}-${index}`}
          value={option.value}
          label={option.label}
          disabled={option.disabled}
          selected={value === option.value}
          highlighted={highlightedIndex === index}
          onClick={onSelect}
          className={itemClassName}
          icon={option.icon}
          iconClassName={iconClassName}
        />
      ))}
    </div>
  );
};
