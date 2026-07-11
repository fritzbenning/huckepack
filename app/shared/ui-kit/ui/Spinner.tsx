import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva("block animate-spin rounded-full border-current border-r-transparent border-solid", {
  variants: {
    size: {
      sm: "h-3.5 w-3.5 border-2",
      md: "h-6 w-6 border-2",
      lg: "h-8 w-8 border-2",
      xl: "h-12 w-12 border-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  label?: string;
  color?: string;
  className?: string;
}

export function Spinner({ size, label, color = "text-primary-500", className = "" }: SpinnerProps) {
  return (
    <div className={cn("flex shrink-0 flex-col items-center gap-4", className)}>
      <output className={cn(spinnerVariants({ size }), color)} aria-label="Loading" />
      {label && <span className="font-medium text-neutral-400 text-sm dark:text-neutral-500">{label}</span>}
    </div>
  );
}
