import { useEffect, useRef, useState } from "react";

export function useOptimisticArray<T>(
  array: T[],
  areEqual: (a: T, b: T) => boolean = (a, b) => a === b
): [T[], (updater: (current: T[]) => T[]) => void] {
  const [optimisticArray, setOptimisticArray] = useState(array);
  const hasPendingUpdatesRef = useRef(false);
  const lastSyncedArrayRef = useRef(array);

  // Check if arrays are equal (shallow comparison)
  const arraysEqual = (a: T[], b: T[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((item, index) => areEqual(item, b[index]));
  };

  // Sync with prop array
  useEffect(() => {
    // If arrays are equal, no need to update
    if (arraysEqual(array, optimisticArray)) {
      lastSyncedArrayRef.current = array;
      hasPendingUpdatesRef.current = false;
      return;
    }

    // If prop changed
    if (!arraysEqual(array, lastSyncedArrayRef.current)) {
      // If we have pending updates, check if the prop now contains our optimistic items
      if (hasPendingUpdatesRef.current) {
        // Check if the new prop array contains all our optimistic items
        const hasAllOptimisticItems = optimisticArray.every((optimisticItem) =>
          array.some((propItem) => areEqual(optimisticItem, propItem))
        );

        if (hasAllOptimisticItems) {
          // Update succeeded, sync with prop (which may have additional items or different order)
          hasPendingUpdatesRef.current = false;
          lastSyncedArrayRef.current = array;
          setOptimisticArray(array);
          return;
        }
      }

      // Prop changed but doesn't match optimistic - sync with prop (revert or external change)
      hasPendingUpdatesRef.current = false;
      lastSyncedArrayRef.current = array;
      setOptimisticArray(array);
    }
  }, [array, optimisticArray, areEqual]);

  const setOptimistic = (updater: (current: T[]) => T[]) => {
    hasPendingUpdatesRef.current = true;
    setOptimisticArray(updater);
  };

  return [optimisticArray, setOptimistic];
}
