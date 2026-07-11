import { useEffect, useMemo, useRef, useState } from "react";

interface UseScopeLoadingOptions {
  minimumDuration?: number; // minimum time to show loading once shown (in milliseconds)
}

export function useScopeLoading(loadingStates: boolean[], options: UseScopeLoadingOptions = {}): boolean {
  const { minimumDuration = 400 } = options;

  const actualLoading = useMemo(() => {
    if (loadingStates.length === 0) {
      return false;
    }
    return loadingStates.some((loading) => loading === true);
  }, [loadingStates]);

  const [scopeLoading, setScopeLoading] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (actualLoading) {
      if (!scopeLoading) {
        setScopeLoading(true);
        startTimeRef.current = Date.now();
      }
    } else {
      if (scopeLoading) {
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
        const remainingTime = Math.max(0, minimumDuration - elapsed);

        hideTimeoutRef.current = setTimeout(() => {
          setScopeLoading(false);
          startTimeRef.current = null;
          hideTimeoutRef.current = null;
        }, remainingTime);
      }
    }

    // Cleanup timeouts on unmount or dependency change
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [actualLoading, minimumDuration, scopeLoading]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return scopeLoading;
}
