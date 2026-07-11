import { useMemo, useRef } from "react";
import { areArraysShallowEqual } from "../comparison/areArraysShallowEqual";
import { areObjectsShallowEqual } from "../comparison/areObjectsShallowEqual";

export function useShallowEqual<T>(value: T): T {
  const prevValueRef = useRef<T>(value);

  // Use useMemo to ensure stable reference and proper comparison timing
  return useMemo(() => {
    // Compare current value with previous
    const hasChanged = (() => {
      // For arrays, compare content
      if (Array.isArray(value) && Array.isArray(prevValueRef.current)) {
        return !areArraysShallowEqual(value as unknown[], prevValueRef.current as unknown[]);
      }
      // For objects, compare shallowly
      if (
        typeof value === "object" &&
        value !== null &&
        typeof prevValueRef.current === "object" &&
        prevValueRef.current !== null
      ) {
        return !areObjectsShallowEqual(
          value as Record<string, unknown>,
          prevValueRef.current as Record<string, unknown>
        );
      }
      // For primitives, compare by value
      return value !== prevValueRef.current;
    })();

    // Update ref and return appropriate value
    if (hasChanged) {
      prevValueRef.current = value;
      return value;
    }

    // Value hasn't changed, return previous reference
    return prevValueRef.current;
  }, [value]);
}
