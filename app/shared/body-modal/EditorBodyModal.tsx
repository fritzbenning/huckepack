import { editorBodyModalRegistry } from "./editorBodyModalRegistry";
import { useEditorBodyModalStore } from "./editorBodyModalStore";
import type { EditorBodyModalComponent, EditorBodyModalContentProps, EditorBodyModalName } from "./types";

export function EditorBodyModal() {
  const { currentModal, isOpen, modalProps, closeEditorBodyModal } = useEditorBodyModalStore();

  if (!currentModal || !isOpen) {
    return null;
  }

  const modalConfig = editorBodyModalRegistry[currentModal as EditorBodyModalName];
  if (!modalConfig) {
    return null;
  }

  const ModalComponent = modalConfig.component as EditorBodyModalComponent<EditorBodyModalName>;

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={closeEditorBodyModal}
      {...(modalProps as EditorBodyModalContentProps<typeof currentModal>)}
      {...modalConfig.defaultProps}
    />
  );
}
