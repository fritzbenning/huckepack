import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

export interface SkeletonItemProps extends VariantProps<typeof skeletonVariants> {
  className?: string;
}

const skeletonVariants = cva(
  "min-h-4 shrink-0 animate-shimmer bg-[length:200%_80%] bg-gradient-to-r from-black/4 via-black/8 to-black/4 dark:from-white/4 dark:via-white/8 dark:to-white/4",
  {
    variants: {
      variant: {
        rectangle: "",
        circle: "aspect-square rounded-full",
      },
      rounded: {
        xs: "rounded-xs",
        sm: "rounded-sm",
        md: "rounded-md",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "rectangle",
      rounded: "md",
    },
  }
);

export function SkeletonItem({ variant = "rectangle", rounded, className = "" }: SkeletonItemProps): ReactNode {
  return <div className={cn(skeletonVariants({ variant, rounded }), className)} />;
}
