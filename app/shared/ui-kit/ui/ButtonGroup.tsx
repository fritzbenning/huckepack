import { cn } from "@lib/utils";
import type React from "react";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

function ButtonGroup({ children, className, ...props }: ButtonGroupProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export default ButtonGroup;
