import { create } from "zustand";
import type { EditorBodyModalContentProps, EditorBodyModalName } from "./types";

interface EditorBodyModalState {
  currentModal: EditorBodyModalName | null;
  isOpen: boolean;
  modalProps: Partial<EditorBodyModalContentProps<EditorBodyModalName>>;

  openEditorBodyModal: <T extends EditorBodyModalName>(
    modalName: T,
    ...args: Record<string, never> extends EditorBodyModalContentProps<T>
      ? [props?: EditorBodyModalContentProps<T>]
      : [props: EditorBodyModalContentProps<T>]
  ) => void;
  closeEditorBodyModal: () => void;
}

export const useEditorBodyModalStore = create<EditorBodyModalState>((set) => ({
  currentModal: null,
  isOpen: false,
  modalProps: {},

  openEditorBodyModal: (modalName, ...args) => {
    const props = args[0] || {};
    set({
      currentModal: modalName,
      isOpen: true,
      modalProps: props,
    });
  },

  closeEditorBodyModal: () => {
    set({
      currentModal: null,
      isOpen: false,
      modalProps: {},
    });
  },
}));

export const openEditorBodyModal = <T extends EditorBodyModalName>(
  modalName: T,
  ...args: Record<string, never> extends EditorBodyModalContentProps<T>
    ? [props?: EditorBodyModalContentProps<T>]
    : [props: EditorBodyModalContentProps<T>]
) => {
  useEditorBodyModalStore.getState().openEditorBodyModal(modalName, ...args);
};

export const closeEditorBodyModal = () => {
  useEditorBodyModalStore.getState().closeEditorBodyModal();
};
