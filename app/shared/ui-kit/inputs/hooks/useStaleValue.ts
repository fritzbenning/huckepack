import { useEffect, useRef } from "react";

export function useStaleValue<T>(
  value: T | undefined,
  isEmpty: (val: T | undefined) => boolean = (val) => val === undefined || val === null || val === ""
): T | undefined {
  const lastValidValueRef = useRef<T | undefined>(undefined);
  const isEmptyRef = useRef(isEmpty);

  useEffect(() => {
    isEmptyRef.current = isEmpty;
  }, [isEmpty]);

  useEffect(() => {
    const isEmptyFn = isEmptyRef.current;
    if (!isEmptyFn(value)) {
      lastValidValueRef.current = value;
    } else if (isEmptyFn(value) && isEmptyFn(lastValidValueRef.current)) {
      lastValidValueRef.current = undefined;
    }
  }, [value]);

  const isEmptyFn = isEmptyRef.current;
  return !isEmptyFn(value) ? value : lastValidValueRef.current;
}
