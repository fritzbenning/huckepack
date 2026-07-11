import { useCallback, useRef, useState } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

export function useCursorGradient() {
  const elementRef = useRef<HTMLElement>(null);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 50, y: 50 });

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setCursorPosition({ x, y });
  }, []);

  return {
    elementRef,
    handleMouseMove,
    cursorPosition,
  };
}
