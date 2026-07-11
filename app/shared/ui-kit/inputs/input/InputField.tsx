import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@lib/utils";
import { type InputFieldVariants, inputFieldVariants } from "./inputFieldVariants";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement>, Partial<InputFieldVariants> {
  icon?: boolean;
  showUnitSelector?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, dimension, tone, align, icon = false, showUnitSelector = false, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputFieldVariants({ dimension, tone, align, icon, showUnitSelector }), className)}
        {...rest}
      />
    );
  }
);
InputField.displayName = "InputField";
