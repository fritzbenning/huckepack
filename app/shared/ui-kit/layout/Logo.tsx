import HuckepackLogo from "@assets/logo/huckepack-logo.svg?react";
import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { LogoBadge } from "./LogoBadge";

const logoVariants = cva("w-auto", {
  variants: {
    size: {
      small: "h-4",
      large: "h-6",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string;
  showBadge?: boolean;
  badgeContent?: React.ReactNode;
}

export default function Logo({ size, className, showBadge = false, badgeContent }: LogoProps) {
  if (showBadge) {
    return (
      <div className="flex items-end justify-end gap-2">
        <HuckepackLogo className={cn(logoVariants({ size }), className)} />
        <LogoBadge size={size} content={badgeContent} />
      </div>
    );
  }

  return <HuckepackLogo className={cn(logoVariants({ size }), className)} />;
}
