import { useCallback, useEffect, useRef } from "react";

export function useRequestAnimationFrame() {
  const frameRef = useRef<number | null>(null);

  const schedule = useCallback((callback: () => void) => {
    // Cancel any pending frame
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    // Schedule new frame
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      callback();
    });

    // Return cleanup function
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  return schedule;
}
