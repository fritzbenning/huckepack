import { cn } from "@lib/utils";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ResizableAsideProps {
  children: ReactNode;
  position: "left" | "right";
  width: number;
  onResize: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

export function ResizableAside({
  children,
  position,
  width,
  onResize,
  minWidth = 200,
  maxWidth = 640,
}: ResizableAsideProps) {
  const asideRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [separatorXPosition, setSeparatorXPosition] = useState<number | undefined>(undefined);
  const [currentWidth, setCurrentWidth] = useState<number | undefined>(undefined);
  const initialWidthRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (asideRef.current && currentWidth === undefined) {
      const initialWidth = width;
      initialWidthRef.current = initialWidth;
      setCurrentWidth(initialWidth);
    }
  }, [width, currentWidth]);

  useEffect(() => {
    if (asideRef.current && currentWidth !== undefined) {
      asideRef.current.style.width = `${currentWidth}px`;
    }
  }, [currentWidth]);

  const onMove = useCallback(
    (clientX: number) => {
      if (!isDragging || currentWidth === undefined || separatorXPosition === undefined || !asideRef.current) {
        return;
      }

      const deltaX = clientX - separatorXPosition;
      const newWidth = position === "left" ? currentWidth + deltaX : currentWidth - deltaX;
      const effectiveMinWidth = initialWidthRef.current ?? minWidth;
      const clampedWidth = Math.max(effectiveMinWidth, Math.min(maxWidth, newWidth));

      setSeparatorXPosition(clientX);
      setCurrentWidth(clampedWidth);
      onResize(clampedWidth);
    },
    [isDragging, currentWidth, separatorXPosition, position, minWidth, maxWidth, onResize]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
      onMove(e.clientX);
    },
    [isDragging, onMove]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      onMove(e.touches[0].clientX);
    },
    [onMove]
  );

  const disableIframePointerEvents = useCallback(() => {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      (iframe as HTMLIFrameElement).style.pointerEvents = "none";
    });
  }, []);

  const enableIframePointerEvents = useCallback(() => {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      (iframe as HTMLIFrameElement).style.pointerEvents = "";
    });
  }, []);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || currentWidth === undefined) return;
      e.preventDefault();
      e.stopPropagation();
      setSeparatorXPosition(e.clientX);
      setIsDragging(true);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      disableIframePointerEvents();
    },
    [currentWidth, disableIframePointerEvents]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (currentWidth === undefined) return;
      setSeparatorXPosition(e.touches[0].clientX);
      setIsDragging(true);
    },
    [currentWidth]
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    setSeparatorXPosition(undefined);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    enableIframePointerEvents();
  }, [enableIframePointerEvents]);

  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchend", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      enableIframePointerEvents();
    };
  }, [isDragging, onMouseMove, onTouchMove, onMouseUp]);

  return (
    <div className="relative h-full min-h-0 shrink-0 flex">
      {position === "right" && (
        <div
          className="flex items-center cursor-col-resize touch-none justify-start"
          style={{ padding: "0 0 0 0.5rem" }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onMouseUp}
        >
          <div
            className={cn(
              "h-full w-0.5 bg-transparent group-hover:bg-neutral-400 dark:group-hover:bg-neutral-500 transition-colors",
              isDragging && "bg-neutral-400 dark:bg-neutral-500"
            )}
          />
        </div>
      )}
      <div ref={asideRef} className="h-full min-h-0">
        {children}
      </div>
      {position === "left" && (
        <div
          className="flex items-center cursor-col-resize touch-none justify-end"
          style={{ padding: "0 0.5rem 0 0" }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onMouseUp}
        >
          <div
            className={cn(
              "h-full w-0.5 bg-transparent group-hover:bg-neutral-400 dark:group-hover:bg-neutral-500 transition-colors",
              isDragging && "bg-neutral-400 dark:bg-neutral-500"
            )}
          />
        </div>
      )}
    </div>
  );
}
