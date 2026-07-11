import { useMutationObserver, useResizeObserver } from "@shared/hooks";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const distanceMap = {
  small: 4,
  medium: 12,
  large: 22,
};

export interface UseSelectPositionOptions {
  triggerRef: React.RefObject<HTMLElement | null>;
  x?: "left" | "right";
  y?: "top" | "bottom";
  distance?: "small" | "medium" | "large";
  xOffset?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

export interface SelectPosition {
  translateX: number;
  translateY: number;
  width: number;
}

export const useSelectPosition = ({
  triggerRef,
  x = "right",
  y = "bottom",
  distance = "small",
  xOffset,
  width,
  style,
}: UseSelectPositionOptions) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<SelectPosition | null>(null);
  const [isPositioned, setIsPositioned] = useState(false);
  const [dropdownElement, setDropdownElement] = useState<HTMLDivElement | null>(null);

  // Store scroll listeners for cleanup
  const scrollableAncestorsRef = useRef<(Element | Window)[]>([]);

  // Callback ref function that updates both the ref and state
  const setDropdownRefCallback = (element: HTMLDivElement | null) => {
    dropdownRef.current = element;
    setDropdownElement(element);
  };

  const updatePosition = useCallback(() => {
    const triggerElement = triggerRef.current;
    const currentDropdownElement = dropdownRef.current;
    if (!triggerElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const distanceValue = distanceMap[distance];

    let effectiveWidth: number;

    if (style?.width) {
      const styleWidth = style.width;
      if (typeof styleWidth === "number") {
        effectiveWidth = styleWidth;
      } else if (typeof styleWidth === "string" && styleWidth.endsWith("px")) {
        effectiveWidth = parseFloat(styleWidth);
      } else {
        effectiveWidth = triggerRect.width;
      }
    } else if (width !== undefined) {
      if (typeof width === "number") {
        effectiveWidth = width;
      } else if (typeof width === "string" && width.endsWith("px")) {
        effectiveWidth = parseFloat(width);
      } else {
        effectiveWidth = triggerRect.width;
      }
    } else {
      effectiveWidth = triggerRect.width;
    }

    const dropdownRect = currentDropdownElement?.getBoundingClientRect();
    let translateX = 0;
    let translateY = 0;

    if (dropdownRect) {
      if (y === "top") {
        translateY = triggerRect.top - dropdownRect.height - distanceValue;
      } else {
        translateY = triggerRect.bottom + distanceValue;
      }

      if (x === "left") {
        translateX = triggerRect.left;
      } else {
        translateX = triggerRect.right - viewportWidth;
      }

      const padding = 8;
      const minY = padding;
      const maxY = viewportHeight - dropdownRect.height - padding;
      translateY = Math.max(minY, Math.min(translateY, maxY));

      if (x === "left") {
        const maxX = viewportWidth - effectiveWidth - padding;
        translateX = Math.max(padding, Math.min(translateX, maxX));
      } else {
        const minX = padding - viewportWidth + effectiveWidth;
        translateX = Math.max(minX, Math.min(translateX, 0));
      }

      if (xOffset !== undefined) {
        translateX += xOffset;
      }
    }

    setPosition({ translateX, translateY, width: effectiveWidth });
    setIsPositioned(true);
  }, [triggerRef, x, y, distance, xOffset, width, style?.width]);

  // Use ResizeObserver for trigger element
  useResizeObserver({
    element: triggerRef.current,
    onResize: updatePosition,
    enabled: !!triggerRef.current,
  });

  // Use ResizeObserver for viewport (document.body)
  useResizeObserver({
    element: document.body,
    onResize: updatePosition,
    enabled: true,
  });

  // Use ResizeObserver for dropdown element
  useResizeObserver({
    element: dropdownElement,
    onResize: updatePosition,
    enabled: !!dropdownElement,
  });

  // Use MutationObserver for dropdown content changes
  useMutationObserver({
    element: dropdownElement,
    onMutation: () => {
      updatePosition();
    },
    enabled: !!dropdownElement,
  });

  // Effect for scroll listeners and initial position update
  useEffect(() => {
    if (!triggerRef.current) {
      setPosition(null);
      setIsPositioned(false);
      return;
    }

    const triggerElement = triggerRef.current;

    // Initial position update with double RAF for layout stability
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePosition();
      });
    });

    // Observe scroll on scrollable ancestors (ResizeObserver doesn't detect scroll)
    const scrollableAncestors: (Element | Window)[] = [];
    let current: Element | null = triggerElement;
    while (current) {
      const computedStyle = window.getComputedStyle(current);
      if (
        computedStyle.overflow === "auto" ||
        computedStyle.overflow === "scroll" ||
        computedStyle.overflowY === "auto" ||
        computedStyle.overflowY === "scroll"
      ) {
        scrollableAncestors.push(current);
      }
      current = current.parentElement;
    }
    // Also add window for window scroll
    scrollableAncestors.push(window);
    scrollableAncestorsRef.current = scrollableAncestors;

    scrollableAncestors.forEach((ancestor) => {
      ancestor.addEventListener("scroll", updatePosition, true);
    });

    return () => {
      cancelAnimationFrame(rafId);
      scrollableAncestors.forEach((ancestor) => {
        ancestor.removeEventListener("scroll", updatePosition, true);
      });
      scrollableAncestorsRef.current = [];
    };
  }, [triggerRef, updatePosition]);

  // Initial update when dropdown becomes available
  useEffect(() => {
    if (dropdownElement) {
      updatePosition();
    }
  }, [dropdownElement, updatePosition]);

  let initialWidth: number | undefined;
  if (triggerRef.current) {
    const triggerRect = triggerRef.current.getBoundingClientRect();

    if (style?.width) {
      const styleWidth = style.width;
      if (typeof styleWidth === "number") {
        initialWidth = styleWidth;
      } else if (typeof styleWidth === "string" && styleWidth.endsWith("px")) {
        initialWidth = parseFloat(styleWidth);
      }
    } else if (width !== undefined) {
      if (typeof width === "number") {
        initialWidth = width;
      } else if (typeof width === "string" && width.endsWith("px")) {
        initialWidth = parseFloat(width);
      }
    }

    if (initialWidth === undefined) {
      initialWidth = triggerRect.width;
    }
  }

  return {
    dropdownRef,
    setDropdownRef: setDropdownRefCallback,
    position,
    isPositioned,
    initialWidth,
  };
};
