import { cn } from "@lib/utils";
import { Check } from "@phosphor-icons/react";
import type React from "react";
import { CheckboxRoot } from "./CheckboxRoot";
import { checkboxLabelVariants, checkboxVariants } from "./checkboxVariants";

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  size?: "small" | "large";
  disabled?: boolean;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  className = "",
  checkboxClassName = "",
  labelClassName = "",
  size = "small",
  disabled = false,
  id,
}) => {
  const handleToggle = () => {
    if (disabled || !onChange) return;
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <CheckboxRoot className={className}>
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(checkboxVariants({ size, checked, disabled }), checkboxClassName)}
        id={id}
      >
        {checked && <Check className={cn("transition-opacity", size === "large" ? "h-3 w-3" : "h-2.5 w-2.5")} weight="duotone" />}
      </div>
      {label && (
        <label htmlFor={id} onClick={handleToggle} className={cn(checkboxLabelVariants({ size, disabled }), labelClassName)}>
          {label}
        </label>
      )}
    </CheckboxRoot>
  );
};
