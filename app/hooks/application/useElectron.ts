"use client";

import { useMemo } from "react";

export function useElectron() {
  return useMemo(() => {
    // Primary detection method: check for window.electron (if preload script works)
    if (window.electron) {
      return true;
    }

    // Fallback detection method: check user agent for 'electron'
    return navigator.userAgent.toLowerCase().includes("electron");
  }, []); // Empty dependency array means this only runs once
}
