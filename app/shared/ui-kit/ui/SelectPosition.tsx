import { useSelectPosition } from "@hooks/useSelectPosition";
import { cn } from "@lib/utils";
import { cva } from "class-variance-authority";
import type React from "react";
import { createPortal } from "react-dom";

const selectPositionVariants = cva("fixed z-200 whitespace-nowrap", {
  variants: {
    size: {
      tiny: "min-w-17",
      small: "min-w-18",
      medium: "w-full min-w-40",
      large: "w-full min-w-40",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export interface SelectPositionProps {
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement | null> | React.RefObject<HTMLButtonElement | null>;
  dropdownRef?: React.RefObject<HTMLDivElement | null>;
  x?: "left" | "right";
  y?: "top" | "bottom";
  distance?: "small" | "medium" | "large";
  xOffset?: number;
  size?: "tiny" | "small" | "medium" | "large";
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const SelectPosition: React.FC<SelectPositionProps> = ({
  children,
  triggerRef,
  dropdownRef: externalDropdownRef,
  x = "right",
  y = "bottom",
  distance = "small",
  xOffset,
  size = "small",
  width,
  className = "",
  style,
}) => {
  const { setDropdownRef, position, isPositioned, initialWidth } = useSelectPosition({
    triggerRef,
    x,
    y,
    distance,
    xOffset,
    width,
    style,
  });

  const setRefs = (element: HTMLDivElement | null) => {
    setDropdownRef(element);
    if (externalDropdownRef) {
      externalDropdownRef.current = element;
    }
  };

  const positionStyle =
    position && isPositioned
      ? {
          ...(x === "left" ? { left: 0 } : { right: 0 }),
          top: 0,
          transform: `translate(${position.translateX}px, ${position.translateY}px)`,
          ...(position.width !== undefined && { width: `${position.width}px`, maxWidth: `${position.width}px` }),
          visibility: "visible" as const,
        }
      : {
          ...(x === "left" ? { left: 0 } : { right: 0 }),
          top: 0,
          transform: "translate(-9999px, -9999px)",
          ...(initialWidth !== undefined && { width: `${initialWidth}px`, maxWidth: `${initialWidth}px` }),
          visibility: "hidden" as const,
        };

  const content = (
    <div
      ref={setRefs}
      className={cn(selectPositionVariants({ size }), className)}
      style={{ ...positionStyle, ...style }}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
};
