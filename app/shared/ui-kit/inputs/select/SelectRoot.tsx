import { cn } from "@lib/utils";
import type React from "react";
import { type SelectRootVariants, selectRootVariants } from "./selectRootVariants";

export interface SelectRootProps extends SelectRootVariants {
  children: React.ReactNode;
  className?: string;
}

export function SelectRoot({ children, className, dimension, height, tone, width }: SelectRootProps) {
  return <div className={cn(selectRootVariants({ dimension, height, tone, width }), className)}>{children}</div>;
}
