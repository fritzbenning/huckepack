import { useMemo } from "react";

export function usePlatform() {
  const isMac = useMemo(() => {
    if (window?.electron) {
      const platform = window.electron.platform;
      return platform === "darwin";
    } else {
      const userAgent = navigator.userAgent;
      return userAgent.includes("Mac");
    }
  }, []);

  return { isMac };
}
