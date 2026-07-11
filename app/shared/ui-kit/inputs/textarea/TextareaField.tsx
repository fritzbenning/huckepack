import type { TextareaHTMLAttributes } from "react";
import { cn } from "@lib/utils";
import { type TextareaVariants, textareaVariants } from "./textareaVariants";

export function TextareaField({
  className,
  dimension,
  width,
  tone,
  align,
  icon = false,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & Partial<TextareaVariants> & { icon?: boolean }) {
  return <textarea className={cn(textareaVariants({ dimension, width, tone, align, icon }), className)} {...rest} />;
}
