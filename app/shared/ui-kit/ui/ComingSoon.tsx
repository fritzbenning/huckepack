import { cn } from "@lib/utils";
import type { ReactNode } from "react";

interface ComingSoonProps {
  children?: ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "subtle" | "muted";
}

const sizeVariants = {
  sm: "text-xs px-2 py-1",
  default: "text-xs px-3 py-2",
  lg: "text-sm px-4 py-3",
};

const variantStyles = {
  default: "text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-750",
  subtle: "text-neutral-500 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-850",
  muted: "text-neutral-400 dark:text-neutral-600 bg-neutral-50 dark:bg-neutral-950",
};

export function ComingSoon({
  children = "Coming soon",
  className,
  size = "default",
  variant = "default",
}: ComingSoonProps) {
  return <div className={cn("rounded-md", sizeVariants[size], variantStyles[variant], className)}>{children}</div>;
}
