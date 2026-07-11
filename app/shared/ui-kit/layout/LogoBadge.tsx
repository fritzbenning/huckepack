import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import packageJson from "../../../../package.json";

const badgeVariants = cva(
  "block rounded-full border border-neutral-150 font-bold text-neutral-400 dark:border-neutral-650 dark:text-neutral-450",
  {
    variants: {
      size: {
        small: "-mb-0.5 shrink-0 px-1.5 py-1.5 text-4xs leading-1",
        large: "mb-1 px-1.5 py-1.5 text-3xs leading-1",
      },
    },
    defaultVariants: {
      size: "small",
    },
  }
);

interface LogoBadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  content?: React.ReactNode;
}

export function LogoBadge({ size, className, content = `alpha v ${packageJson.version}` }: LogoBadgeProps) {
  return <span className={cn(badgeVariants({ size }), className)}>{content}</span>;
}

export { badgeVariants };
