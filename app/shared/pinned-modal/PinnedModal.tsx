import { pinnedModalRegistry } from "./pinnedModalRegistry";
import { usePinnedModalStore } from "./pinnedModalStore";
import type { PinnedModalComponent, PinnedModalName } from "./types";
import { usePinnedModal } from "./usePinnedModal";

export function PinnedModal() {
  const { currentModal, isOpen, modalProps, triggerRef, asidePosition, closePinnedModal } = usePinnedModalStore();
  const { modalContentRef, positionStyle } = usePinnedModal();

  if (!currentModal || !isOpen || !triggerRef || !asidePosition) {
    return null;
  }

  const modalConfig = pinnedModalRegistry[currentModal as PinnedModalName];
  const ModalComponent = modalConfig.component as PinnedModalComponent<PinnedModalName>;

  return (
    <div ref={modalContentRef} className="pointer-events-auto fixed z-100" style={positionStyle}>
      <ModalComponent
        isOpen={isOpen}
        onClose={closePinnedModal}
        triggerRef={triggerRef}
        asidePosition={asidePosition}
        {...modalProps}
        {...modalConfig.defaultProps}
      />
    </div>
  );
}
