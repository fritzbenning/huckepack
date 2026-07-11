import { cn } from "@lib/utils";
import type React from "react";

interface TextareaLabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export const TextareaLabel: React.FC<TextareaLabelProps> = ({ children, className = "", htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block font-medium text-sm text-neutral-750 leading-snug dark:text-neutral-300", className)}
    >
      {children}
    </label>
  );
};
