import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const cardGridVariants = cva("grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", {
  variants: {
    variant: {
      "col-5": "3xl:grid-cols-5 2xl:grid-cols-4",
      "col-4": "3xl:grid-cols-4 2xl:grid-cols-3",
    },
  },
  defaultVariants: {
    variant: "col-5",
  },
});

interface CardGridProps extends VariantProps<typeof cardGridVariants> {
  children: ReactNode;
  className?: string;
}

export function CardGrid({ children, className, variant }: CardGridProps) {
  return <div className={cn(cardGridVariants({ variant }), className)}>{children}</div>;
}
