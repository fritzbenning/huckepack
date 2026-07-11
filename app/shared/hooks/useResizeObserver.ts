import { useEffect, useRef } from "react";

export interface UseResizeObserverOptions {
  /**
   * The element to observe for resize changes
   */
  element: Element | null;
  /**
   * Callback function called when resize occurs
   */
  onResize: (entries: ResizeObserverEntry[]) => void;
  /**
   * ResizeObserver options
   * @default undefined
   */
  options?: ResizeObserverOptions;
  /**
   * Whether the observer is enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook to observe size changes of an element using ResizeObserver
 *
 * @example
 * ```tsx
 * const [element, setElement] = useState<HTMLDivElement | null>(null);
 *
 * useResizeObserver({
 *   element,
 *   onResize: (entries) => {
 *     entries.forEach((entry) => {
 *       console.info('Size changed:', entry.contentRect);
 *     });
 *   },
 * });
 * ```
 */
export const useResizeObserver = ({ element, onResize, options, enabled = true }: UseResizeObserverOptions) => {
  const observerRef = useRef<ResizeObserver | null>(null);
  const callbackRef = useRef(onResize);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = onResize;
  }, [onResize]);

  useEffect(() => {
    if (!enabled || !element) {
      // Clean up existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // Create observer with stable callback
    observerRef.current = new ResizeObserver((entries) => {
      callbackRef.current(entries);
    });

    observerRef.current.observe(element, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [element, enabled, options]);
};
