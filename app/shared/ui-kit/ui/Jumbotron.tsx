import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import type { CSSProperties } from "react";

const jumbotronVariants = cva("text-base", {
  variants: {
    variant: {
      default: "border-neutral-150 bg-white dark:border-neutral-650 dark:bg-neutral-850",
      emphasized: "border-neutral-150 bg-neutral-100 dark:border-neutral-900 dark:bg-black",
    },
    padding: {
      small: "rounded-lg p-2",
      medium: "rounded-xl px-4 pt-3 pb-4",
      large: "rounded-2xl p-7",
    },
    border: {
      true: "border",
      false: "",
    },
    maxWidth: {
      narrow: "max-w-md",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "small",
    border: true,
    maxWidth: "none",
  },
});

interface JumbotronProps extends VariantProps<typeof jumbotronVariants> {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
  style?: CSSProperties;
}

export function Jumbotron({
  children,
  className,
  maxHeight = "",
  variant,
  padding,
  border,
  maxWidth,
  style,
}: JumbotronProps) {
  return (
    <div className={cn(jumbotronVariants({ variant, padding, border, maxWidth }), maxHeight, className)} style={style}>
      {children}
    </div>
  );
}
