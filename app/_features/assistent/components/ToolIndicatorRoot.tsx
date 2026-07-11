import { cn } from "@lib/utils";
import type React from "react";
import {
  type ToolIndicatorRootVariants,
  type ToolIndicatorState,
  toolIndicatorRootVariants,
} from "./toolIndicatorRootVariants";

export interface ToolIndicatorRootProps extends Omit<ToolIndicatorRootVariants, "state"> {
  children: React.ReactNode;
  className?: string;
  state: ToolIndicatorState;
}

export function ToolIndicatorRoot({ children, className, state }: ToolIndicatorRootProps) {
  return <div className={cn(toolIndicatorRootVariants({ state }), className)}>{children}</div>;
}
