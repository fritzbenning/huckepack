import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const modalContainerVariants = cva("relative z-10 flex w-full flex-col bg-white dark:bg-neutral-850", {
  variants: {
    size: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "mx-4 max-w-full",
      custom: "",
    },
    rounded: {
      true: "rounded-lg",
      false: "",
    },
    shadow: {
      true: "shadow-xl/6 dark:shadow-xl/32",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    rounded: true,
    shadow: true,
  },
});

export interface ModalContainerProps extends VariantProps<typeof modalContainerVariants> {
  children: React.ReactNode;
  className?: string;
}

export function ModalContainer({
  children,
  className,
  size = "md",
  rounded = true,
  shadow = true,
}: ModalContainerProps) {
  return <div className={cn(modalContainerVariants({ size, rounded, shadow }), className)}>{children}</div>;
}
