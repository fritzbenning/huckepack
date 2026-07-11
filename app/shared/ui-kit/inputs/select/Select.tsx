import type { Icon } from "@phosphor-icons/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { SelectList, type SelectOption } from "../../ui/SelectList";
import { SelectPosition } from "../../ui/SelectPosition";
import { useStaleValue } from "../hooks/useStaleValue";
import { InputIcon } from "../input/InputIcon";
import { SelectRoot } from "./SelectRoot";
import { SelectTrigger } from "./SelectTrigger";
import type { SelectAlign, SelectDimension, SelectTone, SelectWidth } from "./types";

export interface SelectProps {
  options: SelectOption[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  triggerLabelClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  iconClassName?: string;
  icon?: Icon | string;
  dimension?: SelectDimension;
  tone?: SelectTone;
  width?: SelectWidth;
  align?: SelectAlign;
  x?: "left" | "right";
  y?: "top" | "bottom";
  distance?: "small" | "medium" | "large";
  flyoutDistance?: "small" | "medium";
  xOffset?: number;
  dropdownWidth?: number | string;
  disabled?: boolean;
  height?: "auto" | "default";
  onOpenChange?: (open: boolean) => void;
  hideLabel?: boolean;
  triggerTabIndex?: number;
  actionIcon?: Icon;
  onActionClick?: () => void;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  triggerClassName = "",
  triggerLabelClassName = "",
  contentClassName = "",
  itemClassName = "",
  iconClassName = "",
  icon: Icon,
  dimension = "small",
  tone = "subtle",
  width = "full",
  align = "left",
  x = "right",
  y = "bottom",
  distance,
  flyoutDistance,
  xOffset,
  dropdownWidth,
  disabled = false,
  height = "default",
  onOpenChange,
  hideLabel = false,
  triggerTabIndex,
  actionIcon: ActionIcon,
  onActionClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const staleValue = useStaleValue(value, (val) => val === undefined || val === null || val === "");

  const selectedOption = staleValue !== undefined ? options.find((option) => option.value === staleValue) : undefined;

  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
    }
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (disabled) return;
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideSelect = selectRef.current?.contains(target);
      const isInsideDropdown = dropdownRef.current?.contains(target);

      if (!isInsideSelect && !isInsideDropdown) {
        setIsOpen(false);
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onOpenChange]);

  return (
    <SelectRoot className={className} dimension={dimension} height={height} tone={tone} width={width}>
      <div ref={selectRef} className="relative w-full">
        {Icon && <InputIcon icon={Icon} dimension={dimension} className={iconClassName} />}
        <SelectTrigger
          ref={triggerRef}
          onClick={handleToggle}
          disabled={disabled}
          isOpen={isOpen}
          placeholder={placeholder}
          selectedLabel={selectedOption?.label}
          dimension={dimension}
          tone={tone}
          align={align}
          icon={!!Icon}
          className={triggerClassName}
          labelClassName={triggerLabelClassName}
          hideLabel={hideLabel}
          tabIndex={triggerTabIndex}
          actionIcon={ActionIcon}
          onActionClick={onActionClick}
        />

        {isOpen && (
          <SelectPosition
            triggerRef={triggerRef}
            dropdownRef={dropdownRef}
            x={x}
            y={y}
            distance={distance ?? flyoutDistance}
            xOffset={xOffset}
            width={dropdownWidth}
            size={
              dimension === "tiny"
                ? "tiny"
                : dimension === "small"
                  ? "small"
                  : dimension === "medium"
                    ? "medium"
                    : "large"
            }
          >
            <SelectList
              options={options}
              value={value}
              onSelect={handleSelect}
              size={
                dimension === "tiny"
                  ? "tiny"
                  : dimension === "small"
                    ? "small"
                    : dimension === "medium"
                      ? "medium"
                      : "large"
              }
              contentClassName={contentClassName}
              itemClassName={itemClassName}
              iconClassName={iconClassName}
            />
          </SelectPosition>
        )}
      </div>
    </SelectRoot>
  );
};
