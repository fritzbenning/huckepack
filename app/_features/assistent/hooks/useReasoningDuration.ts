import { useEffect, useRef, useState } from "react";

export function useReasoningDuration(content: string, isDone: boolean) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (content.length > 0 && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      hasCompletedRef.current = false;

      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setElapsedSeconds(elapsed);
        }
      }, 100);
    }

    if (isDone && startTimeRef.current !== null && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (startTimeRef.current) {
        const finalElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedSeconds(finalElapsed);
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [content, isDone]);

  return elapsedSeconds;
}

