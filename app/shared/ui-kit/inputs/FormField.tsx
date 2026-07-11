import type React from "react";
import { InputLabel } from "./input/InputLabel";

export interface FormFieldProps {
  label: string;
  description?: string;
  htmlFor?: string;
  children: React.ReactNode;
  customContent?: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  description,
  htmlFor,
  customContent,
  children,
  className = "",
}) => {
  return (
    <figure
      className={`flex gap-10 border-neutral-200 border-b pb-5 last:border-b-0 last:pb-0 dark:border-neutral-750 ${className}`}
    >
      <figcaption className="flex flex-3 flex-col gap-0.5">
        <InputLabel htmlFor={htmlFor}>{label}</InputLabel>
        {description && <p className="text-2xs text-neutral-500 leading-tight dark:text-neutral-400">{description}</p>}
        {customContent && <div className="mt-4">{customContent}</div>}
      </figcaption>
      <div className="flex flex-4 flex-col gap-2">{children}</div>
    </figure>
  );
};
