import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Parameters for the useDetectedRuleState hook.
 */
interface UseDetectedRuleStateParams {
  /** Array of class tokens to check, or null if not available */
  classTokens: string[] | null;
  /** Function that determines if a rule is detected based on the class tokens */
  detect: (classTokens: string[] | null) => boolean;
}

/**
 * Hook that manages the active state of a detected design property.
 *
 * The hook detects if a rule is present based on class tokens and maintains
 * an active state that syncs with the detection. It also provides a toggle
 * function to manually change the active state.
 *
 * @param params - Configuration object containing classTokens and detect function
 * @returns Object containing:
 *   - `isActive`: Boolean indicating whether the rule is currently active
 *   - `toggle`: Function to toggle the active state
 *
 * @example
 * ```tsx
 * const { isActive, toggle } = useDetectedRuleState({
 *   classTokens: ['flex', 'items-center'],
 *   detect: (tokens) => tokens?.includes('flex') ?? false
 * });
 * ```
 */
export function useDetectedRuleState({ classTokens, detect }: UseDetectedRuleStateParams) {
  const isDetected = useMemo(() => detect(classTokens), [classTokens, detect]);

  const [isActive, setIsActive] = useState(isDetected);

  useEffect(() => {
    setIsActive(isDetected);
  }, [isDetected]);

  const toggle = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  return {
    isActive,
    toggle,
  };
}
