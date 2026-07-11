import type React from "react";
import { cn } from "@lib/utils";

export function TextareaRoot({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("group relative flex flex-col gap-2", className)}>{children}</div>;
}
