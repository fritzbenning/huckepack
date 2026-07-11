import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { Circle } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";

const containerVariants = cva(
  "inspector-tool flex gap-1 p-0.5 text-neutral-500 hover:text-neutral-750 dark:hover:text-neutral-300",
  {
    variants: {
      size: {
        small: "",
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
      large: "size-4",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export interface IconToggleProps {
  icon: Icon | React.ComponentType<ComponentProps<"svg">>;
  isActive: boolean;
  onChange?: () => void | Promise<void>;
  className?: string;
  size?: "small" | "large";
  iconProps?: Omit<ComponentProps<"svg">, "className">;
}

export function IconToggle({
  icon: Icon = Circle,
  isActive,
  onChange,
  className = "",
  size = "small",
  iconProps,
}: IconToggleProps) {
  return (
    <div className={cn(containerVariants({ size }), className)}>
      <button type="button" className={buttonVariants({ size, active: isActive })} onClick={() => onChange?.()}>
        <Icon className={iconVariants({ size })} {...iconProps} />
      </button>
    </div>
  );
}
