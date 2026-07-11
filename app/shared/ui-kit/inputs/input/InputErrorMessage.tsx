import { cn } from "@lib/utils";
import type React from "react";

export interface InputErrorMessageProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const InputErrorMessage: React.FC<InputErrorMessageProps> = ({ children, className = "", id }) => {
  if (!children) {
    return null;
  }

  return (
    <span id={id} className={cn("text-2xs text-red-600 dark:text-red-400", className)} role="alert">
      {children}
    </span>
  );
};

InputErrorMessage.displayName = "InputErrorMessage";
