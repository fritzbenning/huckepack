import { cn } from "@lib/utils";
import type React from "react";
import { type InputRootVariants, inputRootVariants } from "./inputRootVariants";

export interface InputRootProps extends InputRootVariants {
  children: React.ReactNode;
  className?: string;
}

export function InputRoot({ children, className, dimension, tone, width, error, disabled }: InputRootProps) {
  return (
    <div className={cn(inputRootVariants({ dimension, tone, width, error, disabled }), className)}>{children}</div>
  );
}
