import { cn } from "@lib/utils";

export interface BreadcrumbDividerProps {
  className?: string;
}

export function BreadcrumbDivider({ className }: BreadcrumbDividerProps) {
  return (
    <span className={cn("-mt-0.25 px-1.5 font-medium text-sm text-neutral-400 dark:text-neutral-500", className)}>
      /
    </span>
  );
}

export default BreadcrumbDivider;
