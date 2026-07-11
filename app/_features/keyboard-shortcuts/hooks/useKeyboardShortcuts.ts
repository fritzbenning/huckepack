import { useSpotlightStore } from "@editor/spotlight/stores/spotlightStore";
import { processKeyboardEvent } from "@keyboard-shortcuts/services/processKeyboardEvent";
import { useModalStore } from "@shared/modal/modalStore";
import { useEffect, useEffectEvent } from "react";
import { shouldExcludeTarget } from "../utils/shouldExcludeTarget";

export const useKeyboardShortcuts = (options: { projectId: string; fileId: string; excludeTargets?: string[] }) => {
  const { projectId, fileId, excludeTargets } = options;

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;

    if (shouldExcludeTarget(target, excludeTargets)) {
      return;
    }

    if (useSpotlightStore.getState().isOpen) {
      return;
    }

    if (useModalStore.getState().isOpen) {
      return;
    }

    if (!projectId || !fileId || projectId === "" || fileId === "") {
      return;
    }

    processKeyboardEvent(event, projectId, fileId).catch((error) => {
      console.error("[useKeyboardShortcuts] Error processing keyboard event:", error);
    });
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
