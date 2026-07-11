import { useEffect, useRef, useState } from "react";

export function useOptimisticValue<T>(value: T): [T, (newValue: T) => void] {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const pendingOptimisticValueRef = useRef<T | null>(null);
  const lastSyncedValueRef = useRef(value);

  // Sync with prop value, but only if:
  // 1. Prop value changed AND
  // 2. Either there's no pending optimistic update, OR the prop matches our optimistic value
  useEffect(() => {
    // If we have a pending optimistic update and the prop now matches it, we're good
    if (pendingOptimisticValueRef.current !== null && value === pendingOptimisticValueRef.current) {
      pendingOptimisticValueRef.current = null;
      lastSyncedValueRef.current = value;
      // Optimistic value is already correct, no need to update
      return;
    }

    // If prop changed and doesn't match our optimistic value, sync with prop
    if (value !== lastSyncedValueRef.current) {
      // Clear any pending optimistic update since prop has changed
      pendingOptimisticValueRef.current = null;
      lastSyncedValueRef.current = value;

      // Only update if different to avoid unnecessary re-renders
      if (optimisticValue !== value) {
        setOptimisticValue(value);
      }
    }
  }, [value, optimisticValue]);

  const setOptimistic = (newValue: T) => {
    pendingOptimisticValueRef.current = newValue;
    setOptimisticValue(newValue);
  };

  return [optimisticValue, setOptimistic];
}
