import { cn } from "@lib/utils";
import type React from "react";
import { forwardRef } from "react";
import { type InputLabelVariants, inputLabelVariants } from "./inputLabelVariants";

export interface InputLabelProps extends Partial<InputLabelVariants> {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ children, className = "", htmlFor, dimension }, ref) => {
    return (
      <label ref={ref} htmlFor={htmlFor} className={cn(inputLabelVariants({ dimension }), className)}>
        {children}
      </label>
    );
  }
);
InputLabel.displayName = "InputLabel";
