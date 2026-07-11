import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { Circle } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";

const containerVariants = cva(
  "inspector-tool flex gap-1 p-0.5 text-neutral-500 hover:text-neutral-750 dark:hover:text-neutral-300",
  {
    variants: {
      size: {
        small: "",
        medium: "",
        large: "border border-neutral-200 dark:border-neutral-750",
      },
    },
    defaultVariants: {
      size: "small",
    },
  }
);

const buttonVariants = cva("flex flex-1 items-center justify-center border focus:outline-none", {
  variants: {
    size: {
      small: "h-6 min-w-6",
      medium: "h-7 min-w-7",
      large: "h-8 min-w-8",
    },
    active: {
      true: "inspector-tool-active",
      false:
        "border-transparent text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300",
    },
  },
  defaultVariants: {
    size: "small",
    active: false,
  },
});

const iconVariants = cva("currentColor block", {
  variants: {
    size: {
      small: "size-3.5",
      medium: "size-4",
      large: "size-4",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export interface IconTabItem<T> {
  value: T;
  icon: Icon;
  label?: string;
}

export interface IconTabsProps<T> {
  items: IconTabItem<T>[];
  activeValue: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "small" | "medium" | "large";
}

export function IconTabs<T>({ items, activeValue, onChange, className = "", size = "small" }: IconTabsProps<T>) {
  return (
    <div className={cn(containerVariants({ size }), className)}>
      {items.map((item) => {
        const Icon = item.icon || Circle;
        return (
          <button
            type="button"
            key={String(item.value)}
            className={buttonVariants({ size, active: activeValue === item.value })}
            onClick={() => onChange(item.value)}
            title={item.label}
          >
            <Icon className={iconVariants({ size })} />
          </button>
        );
      })}
    </div>
  );
}
