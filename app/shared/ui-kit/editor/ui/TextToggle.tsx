import { cn } from "@lib/utils";
import { cva } from "class-variance-authority";

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
      small: "h-6 min-w-6 px-2",
      large: "h-8 min-w-8 px-3",
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

const textVariants = cva("font-medium text-2xs", {
  variants: {
    size: {
      small: "text-2xs",
      large: "text-xs",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export interface TextToggleProps {
  text: string;
  isActive: boolean;
  onChange?: () => void | Promise<void>;
  className?: string;
  size?: "small" | "large";
}

export function TextToggle({ text, isActive, onChange, className = "", size = "small" }: TextToggleProps) {
  return (
    <div className={cn(containerVariants({ size }), className)}>
      <button type="button" className={buttonVariants({ size, active: isActive })} onClick={() => onChange?.()}>
        <span className={textVariants({ size })}>{text}</span>
      </button>
    </div>
  );
}
