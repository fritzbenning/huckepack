import { openPinnedModal, type PinnedModalContentProps, type PinnedModalName } from "@shared/pinned-modal";
import { useCallback, useRef } from "react";

export function useModalTrigger() {
  const ref = useRef<HTMLButtonElement>(null);

  const open = useCallback(
    <T extends PinnedModalName>(
      modalId: T,
      position: "left" | "right" = "left",
      ...args: Record<string, never> extends PinnedModalContentProps<T>
        ? [props?: PinnedModalContentProps<T>]
        : [props: PinnedModalContentProps<T>]
    ) => {
      if (ref.current) {
        openPinnedModal(modalId, ref, position, ...args);
      } else {
        console.warn(`Modal trigger ref is null for ${modalId}`);
      }
    },
    []
  );

  return { ref, open };
}
