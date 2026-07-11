import { useCallback, useState } from "react";
import { executeAction } from "./executeAction";
import type { ActionName, ActionParams, ActionResult } from "./types";

export const useAsyncAction = <T extends ActionName>(
  actionName: T,
  options?: {
    onSuccess?: (result: ActionResult<T>) => void;
    onError?: (error: string) => void;
  }
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const action = useCallback(
    async (args: ActionParams<T>): Promise<ActionResult<T> | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await executeAction(actionName, args);
        setLoading(false);
        options?.onSuccess?.(result as ActionResult<T>);
        return result as ActionResult<T>;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        setLoading(false);
        options?.onError?.(errorMsg);
        return null;
      }
    },
    [actionName, options?.onSuccess, options?.onError]
  );

  return { action, loading, error };
};
