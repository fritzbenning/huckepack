import { useEffect, useRef } from "react";

export interface UseMutationObserverOptions {
  /**
   * The element to observe for mutations
   */
  element: Element | null;
  /**
   * Callback function called when mutations occur
   */
  onMutation: (mutations: MutationRecord[]) => void;
  /**
   * MutationObserver options
   * @default { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] }
   */
  options?: MutationObserverInit;
  /**
   * Whether the observer is enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook to observe DOM mutations of an element using MutationObserver
 *
 * @example
 * ```tsx
 * const [element, setElement] = useState<HTMLDivElement | null>(null);
 *
 * useMutationObserver({
 *   element,
 *   onMutation: (mutations) => {
 *     mutations.forEach((mutation) => {
 *       console.info('Mutation:', mutation.type);
 *     });
 *   },
 * });
 * ```
 */
export const useMutationObserver = ({
  element,
  onMutation,
  options = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  },
  enabled = true,
}: UseMutationObserverOptions) => {
  const observerRef = useRef<MutationObserver | null>(null);
  const callbackRef = useRef(onMutation);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = onMutation;
  }, [onMutation]);

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
    observerRef.current = new MutationObserver((mutations) => {
      callbackRef.current(mutations);
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






