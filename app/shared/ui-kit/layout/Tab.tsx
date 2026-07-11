"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { Link } from "react-router-dom";

const tabVariants = cva("group h-7 rounded-sm transition-colors", {
  variants: {
    variant: {
      icon: "px-2",
      file: "flex min-w-36 items-center justify-between gap-1 px-2",
    },
    isActive: {
      true: "bg-white/60 hover:bg-white/50 dark:bg-black/40 hover:dark:bg-black/30",
      false: "hover:bg-white/20 dark:hover:bg-black/20",
    },
  },
  defaultVariants: {
    variant: "icon",
    isActive: false,
  },
});

interface TabProps extends VariantProps<typeof tabVariants> {
  to?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export default function Tab({ to, children, variant, isActive, onClick, className }: TabProps) {
  if (to) {
    return (
      <Link
        to={to}
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        className={tabVariants({ variant, isActive, className })}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      className={tabVariants({ variant, isActive, className })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export { tabVariants };
