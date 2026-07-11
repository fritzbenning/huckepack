import { create } from "zustand";
import type { ModalContentProps, ModalName } from "./types";

interface ModalState {
  // Current modal state
  currentModal: ModalName | null;
  isOpen: boolean;
  modalProps: ModalContentProps<ModalName>;

  // Actions
  openModal: <T extends ModalName>(
    modalName: T,
    ...args: Record<string, never> extends ModalContentProps<T>
      ? [props?: ModalContentProps<T>]
      : [props: ModalContentProps<T>]
  ) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  currentModal: null,
  isOpen: false,
  modalProps: {},

  openModal: (modalName, ...args) => {
    const props = args[0] || {};
    set({
      currentModal: modalName,
      isOpen: true,
      modalProps: props,
    });
  },

  closeModal: () => {
    set({
      currentModal: null,
      isOpen: false,
      modalProps: {},
    });
  },
}));

export const openModal = <T extends ModalName>(
  modalName: T,
  ...args: Record<string, never> extends ModalContentProps<T>
    ? [props?: ModalContentProps<T>]
    : [props: ModalContentProps<T>]
) => {
  useModalStore.getState().openModal(modalName, ...args);
};

export const closeModal = () => {
  useModalStore.getState().closeModal();
};
