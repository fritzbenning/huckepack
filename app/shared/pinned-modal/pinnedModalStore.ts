import { create } from "zustand";
import type { PinnedModalContentProps, PinnedModalName } from "./types";

interface PinnedModalState {
  // Current pinned modal state
  currentModal: PinnedModalName | null;
  isOpen: boolean;
  modalProps: PinnedModalContentProps<PinnedModalName>;
  triggerRef: React.RefObject<HTMLElement | null> | null;
  asidePosition: "left" | "right" | null;

  // Actions
  openPinnedModal: <T extends PinnedModalName>(
    modalName: T,
    triggerRef: React.RefObject<HTMLElement | null>,
    asidePosition: "left" | "right",
    ...args: Record<string, never> extends PinnedModalContentProps<T>
      ? [props?: PinnedModalContentProps<T>]
      : [props: PinnedModalContentProps<T>]
  ) => void;
  closePinnedModal: () => void;
}

export const usePinnedModalStore = create<PinnedModalState>((set) => ({
  currentModal: null,
  isOpen: false,
  modalProps: {},
  triggerRef: null,
  asidePosition: null,

  openPinnedModal: (modalName, triggerRef, asidePosition, ...args) => {
    const props = args[0] || {};
    set({
      currentModal: modalName,
      isOpen: true,
      modalProps: props,
      triggerRef,
      asidePosition,
    });
  },

  closePinnedModal: () => {
    set({
      currentModal: null,
      isOpen: false,
      modalProps: {},
      triggerRef: null,
      asidePosition: null,
    });
  },
}));

export const openPinnedModal = <T extends PinnedModalName>(
  modalName: T,
  triggerRef: React.RefObject<HTMLElement | null>,
  asidePosition: "left" | "right",
  ...args: Record<string, never> extends PinnedModalContentProps<T>
    ? [props?: PinnedModalContentProps<T>]
    : [props: PinnedModalContentProps<T>]
) => {
  usePinnedModalStore.getState().openPinnedModal(modalName, triggerRef, asidePosition, ...args);
};

export const closePinnedModal = () => {
  usePinnedModalStore.getState().closePinnedModal();
};

