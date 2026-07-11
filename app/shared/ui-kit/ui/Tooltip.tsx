import { useApplicationStore } from "@application/stores/applicationStore";
import { useClickOutside } from "@hooks/useClickOutside";
import { cn } from "@lib/utils";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

const tooltipBaseClasses =
  "pointer-events-none fixed z-30 whitespace-nowrap rounded-md px-2 py-1 font-medium text-3xs shadow-lg backdrop-blur-sm";

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  position?: "top" | "bottom";
  align?: "start" | "center" | "end";
  trigger?: "hover" | "click";
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  delayDuration?: number;
  display?: "flex" | "inline-flex" | "block" | "inline-block" | "inline" | "grid" | "inline-grid";
}

const TOOLTIP_MODE_DURATION = 2000;

export function Tooltip({
  children,
  content,
  position = "top",
  align = "center",
  trigger = "hover",
  disabled = false,
  className = "",
  triggerClassName = "",
  delayDuration = 800,
  display = "inline-block",
}: TooltipProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipModeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState<{ top: number; left: number } | null>(null);

  const tooltipMode = useApplicationStore((state) => state.tooltipMode);
  const enableTooltipMode = useApplicationStore((state) => state.enableTooltipMode);
  const disableTooltipMode = useApplicationStore((state) => state.disableTooltipMode);

  const handleMouseEnter = () => {
    if (trigger === "hover" && !disabled) {
      if (tooltipModeTimeoutRef.current) {
        clearTimeout(tooltipModeTimeoutRef.current);
        tooltipModeTimeoutRef.current = null;
      }

      const effectiveDelay = tooltipMode ? 0 : delayDuration;

      if (effectiveDelay > 0) {
        const timeout = setTimeout(() => {
          setIsOpen(true);
          enableTooltipMode();
          tooltipModeTimeoutRef.current = setTimeout(() => {
            disableTooltipMode();
          }, TOOLTIP_MODE_DURATION);
        }, effectiveDelay);
        setShowTimeout(timeout);
      } else {
        setIsOpen(true);
        tooltipModeTimeoutRef.current = setTimeout(() => {
          disableTooltipMode();
        }, TOOLTIP_MODE_DURATION);
      }
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover" && !disabled) {
      if (showTimeout) {
        clearTimeout(showTimeout);
        setShowTimeout(null);
      }
      setIsOpen(false);

      if (tooltipModeTimeoutRef.current) {
        clearTimeout(tooltipModeTimeoutRef.current);
        tooltipModeTimeoutRef.current = null;
      }
      tooltipModeTimeoutRef.current = setTimeout(() => {
        disableTooltipMode();
      }, TOOLTIP_MODE_DURATION);
    }
  };

  const handleClick = () => {
    if (trigger === "click" && !disabled) {
      setIsOpen(!isOpen);
    }
  };

  useClickOutside(containerRef, () => setIsOpen(false), isOpen && trigger === "click");

  useEffect(() => {
    if (!isOpen || !containerRef.current || !tooltipRef.current) {
      setCoordinates(null);
      return;
    }

    const updatePosition = () => {
      const triggerRect = containerRef.current!.getBoundingClientRect();
      const tooltipRect = tooltipRef.current!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = 0;
      let left = 0;

      if (position === "top") {
        top = triggerRect.top - tooltipRect.height - 6;
      } else {
        top = triggerRect.bottom + 6;
      }

      if (align === "start") {
        left = triggerRect.left;
      } else if (align === "end") {
        left = triggerRect.right - tooltipRect.width;
      } else {
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      }

      const padding = 8;
      top = Math.max(padding, Math.min(top, viewportHeight - tooltipRect.height - padding));
      left = Math.max(padding, Math.min(left, viewportWidth - tooltipRect.width - padding));

      setCoordinates({ top, left });
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePosition();
      });
    });

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, position, align]);

  useEffect(() => {
    return () => {
      if (showTimeout) {
        clearTimeout(showTimeout);
      }
      if (tooltipModeTimeoutRef.current) {
        clearTimeout(tooltipModeTimeoutRef.current);
      }
    };
  }, [showTimeout]);

  if (disabled || !content) {
    return children;
  }

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={cn(display, triggerClassName)}
        ref={containerRef}
      >
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(tooltipBaseClasses, "bg-black/50 text-neutral-100", className)}
            role="tooltip"
            style={
              coordinates
                ? {
                    top: `${coordinates.top}px`,
                    left: `${coordinates.left}px`,
                  }
                : { visibility: "hidden" }
            }
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
