import { useUIMessages } from "@convex-dev/agent/react";
import { useRef } from "react";

export const useStableUIMessages = ((query, args, options) => {
  const result = useUIMessages(query, args, options);
  const stored = useRef(result);

  if (result.status !== "LoadingFirstPage") {
    stored.current = result;
  }

  return stored.current;
}) as typeof useUIMessages;

