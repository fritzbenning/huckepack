import { cn } from "@lib/utils";
import type React from "react";
import { SwitchRoot } from "./SwitchRoot";
import { switchLabelVariants, switchToggleVariants, switchVariants } from "./switchVariants";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
  switchClassName?: string;
  labelClassName?: string;
  size?: "small" | "large";
  disabled?: boolean;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  label,
  className = "",
  switchClassName = "",
  labelClassName = "",
  size = "small",
  disabled = false,
  id,
}) => {
  const handleToggle = () => {
    if (disabled || !onCheckedChange) return;
    onCheckedChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <SwitchRoot className={className}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(switchVariants({ size, checked, disabled }), switchClassName)}
        id={id}
      >
        <span className={cn(switchToggleVariants({ size, checked }))} />
      </button>
      {label && (
        <label htmlFor={id} onClick={handleToggle} className={cn(switchLabelVariants({ size, disabled }), labelClassName)}>
          {label}
        </label>
      )}
    </SwitchRoot>
  );
};
