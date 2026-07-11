import type React from "react";
import { cn } from "@lib/utils";

export function SwitchRoot({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("group relative flex items-center gap-2", className)}>{children}</div>;
}
