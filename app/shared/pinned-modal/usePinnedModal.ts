import { useEffect, useRef, useState } from "react";
import { usePinnedModalStore } from "./pinnedModalStore";

export function usePinnedModal() {
  const { isOpen, triggerRef, asidePosition, closePinnedModal } = usePinnedModalStore();
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left?: number; right?: number } | null>(null);
  const [isPositioned, setIsPositioned] = useState(false);

  useEffect(() => {
    if (!isOpen || !triggerRef?.current || !asidePosition) {
      setPosition(null);
      setIsPositioned(false);
      return;
    }

    setIsPositioned(false);

    const updatePosition = () => {
      const triggerElement = triggerRef.current;
      if (!triggerElement || !modalContentRef.current) return;

      const triggerRect = triggerElement.getBoundingClientRect();
      const modalRect = modalContentRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const top = triggerRect.top;

      let asideElement: HTMLElement | null = triggerElement.parentElement;
      while (asideElement && !asideElement.classList.contains("w-74") && !asideElement.classList.contains("w-85")) {
        asideElement = asideElement.parentElement;
      }

      const detectedAsidePosition: "left" | "right" = asideElement
        ? asideElement.classList.contains("border-r-1")
          ? "left"
          : "right"
        : asidePosition;
      let left: number | undefined;
      let right: number | undefined;

      const asideWidth = asideElement ? asideElement.getBoundingClientRect().width : 296;

      if (detectedAsidePosition === "left") {
        left = asideWidth;
        right = undefined;
      } else {
        left = undefined;
        right = asideWidth;
      }
      const clampedTop = Math.max(12, Math.min(top, viewportHeight - modalRect.height - 12));

      setPosition({
        top: clampedTop,
        ...(left !== undefined ? { left } : {}),
        ...(right !== undefined ? { right } : {}),
      });
      setIsPositioned(true);
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
  }, [isOpen, triggerRef, asidePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePinnedModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closePinnedModal]);

  const positionStyle =
    position && isPositioned
      ? {
          top: `${position.top}px`,
          ...(position.left !== undefined ? { left: `${position.left + 8}px` } : {}),
          ...(position.right !== undefined ? { right: `${position.right + 8}px` } : {}),
          visibility: "visible" as const,
        }
      : {
          top: "-9999px",
          left: "-9999px",
          visibility: "hidden" as const,
        };

  return {
    modalContentRef,
    position,
    isPositioned,
    positionStyle,
  };
}
