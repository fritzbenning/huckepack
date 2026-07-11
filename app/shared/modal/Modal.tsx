import { modalRegistry } from "./modalRegistry";
import { useModalStore } from "./modalStore";
import type { ModalComponent, ModalName } from "./types";

export function Modal() {
  const { currentModal, isOpen, modalProps, closeModal } = useModalStore();

  if (!currentModal || !isOpen) {
    return null;
  }

  const modalConfig = modalRegistry[currentModal as ModalName];
  const ModalComponent = modalConfig.component as ModalComponent<ModalName>;

  return <ModalComponent isOpen={isOpen} onClose={closeModal} {...modalProps} {...modalConfig.defaultProps} />;
}
