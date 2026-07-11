import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const asideVariants = cva(
  "z-10 h-full shrink-0 border-neutral-100 bg-white transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-850",
  {
    variants: {
      position: {
        left: "border-t-0 border-r-1 border-b-0 border-l-0",
        right: "border-t-0 border-r-0 border-b-0 border-l-1",
      },
      layout: {
        auto: "flex flex-col",
        full: "grid min-h-0 grid-rows-[auto_1fr]",
      },
      fixedWidth: {
        true: "w-74",
        false: "",
      },
    },
    defaultVariants: {
      position: "left",
      layout: "auto",
      fixedWidth: false,
    },
  }
);

interface AsideProps extends VariantProps<typeof asideVariants> {
  children: ReactNode;
  className?: string;
  width?: number;
}

export function Aside({ position, layout = "auto", fixedWidth, children, className, width }: AsideProps) {
  const focusMode = false;

  return (
    <div
      className={cn(
        asideVariants({ position, layout, fixedWidth }),
        position === "right",
        focusMode && "hidden",
        className
      )}
      style={width ? { width: `${width}px` } : undefined}
    >
      {children}
    </div>
  );
}
