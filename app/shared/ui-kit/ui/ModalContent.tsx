import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const modalContentVariants = cva("space-y-2.5 text-sm text-neutral-750 dark:text-neutral-300", {
  variants: {
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-5",
    },
    scrollable: {
      true: "overflow-y-auto",
      false: "",
    },
  },
  defaultVariants: {
    padding: "md",
    scrollable: false,
  },
});

export interface ModalContentProps extends Omit<VariantProps<typeof modalContentVariants>, "padding"> {
  children: React.ReactNode;
  className?: string;
  padding?: boolean | "sm" | "md" | "lg";
}

export function ModalContent({ children, className, padding = true, scrollable = false }: ModalContentProps) {
  // Convert boolean padding to variant value
  const paddingVariant = padding === true ? "md" : padding === false ? "none" : padding;

  return <div className={cn(modalContentVariants({ padding: paddingVariant, scrollable }), className)}>{children}</div>;
}
