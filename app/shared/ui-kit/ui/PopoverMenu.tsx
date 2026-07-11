import { useClickOutside } from "@hooks/useClickOutside";
import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import type React from "react";
import { type ReactNode, useRef, useState } from "react";
import { SelectList } from "./SelectList";
import { SelectPosition } from "./SelectPosition";

export interface PopoverMenuItem {
  icon: Icon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface PopoverMenuProps {
  children: ReactNode;
  items?: PopoverMenuItem[];
  x?: "left" | "right";
  y?: "top" | "bottom";
  size?: "small" | "large";
  className?: string;
  disabled?: boolean;
  trigger?: "hover" | "click";
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({
  children,
  items,
  x = "right",
  y = "bottom",
  size = "large",
  className = "",
  disabled = false,
  trigger = "hover",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (trigger === "hover" && !disabled) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover" && !disabled) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    if (trigger === "click" && !disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleItemClick = (item: PopoverMenuItem) => {
    item.onClick();
    if (trigger === "click") {
      setIsOpen(false);
    }
  };

  // Handle click outside to close popover
  useClickOutside(containerRef, () => setIsOpen(false), isOpen && trigger === "click");

  return (
    <div
      ref={containerRef}
      className={cn("group relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}

      {items && items.length > 0 && isOpen && (
        <SelectPosition triggerRef={containerRef} x={x} y={y} size={size}>
          <SelectList
            options={items.map((item, index) => ({
              value: index.toString(),
              label: item.label,
              icon: item.icon,
              disabled: false,
            }))}
            value={items.findIndex((item) => item.isActive) !== -1 ? items.findIndex((item) => item.isActive).toString() : undefined}
            onSelect={(value) => {
              const selectedItem = items[parseInt(value, 10)];
              if (selectedItem) {
                handleItemClick(selectedItem);
              }
            }}
            size="large"
            contentClassName="p-1 gap-1"
            itemClassName="font-medium whitespace-nowrap w-full flex items-center gap-2 text-left text-xs px-3 py-2 rounded transition-colors"
          />
        </SelectPosition>
      )}
    </div>
  );
};
