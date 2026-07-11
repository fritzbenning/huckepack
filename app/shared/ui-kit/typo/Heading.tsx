import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const headingVariants = cva("font-bricolage text-neutral-950 dark:text-neutral-100", {
  variants: {
    variant: {
      hero: "font-bold text-4xl leading-tight",
      h1: "font-bold text-3xl leading-tight",
      h2: "font-bold text-2xl leading-tight",
      h3: "font-bold text-xl leading-snug",
      h4: "font-bold text-base leading-snug",
      h5: "font-bold text-sm leading-normal",
      h6: "font-bold text-xs leading-normal",
    },
  },
  defaultVariants: {
    variant: "h1",
  },
});

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, variant, as, ...props }, ref) => {
  const Component = as || "h1";

  return <Component className={cn(headingVariants({ variant }), className)} ref={ref} {...props} />;
});

Heading.displayName = "Heading";

export { Heading, headingVariants };
