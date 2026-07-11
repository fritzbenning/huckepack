import { CraneTowerIcon } from "@phosphor-icons/react";
import type { BaseModalProps } from "@shared/modal/types";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalContent } from "@shared/ui-kit/ui/ModalContent";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";

interface NotImplementedProps extends BaseModalProps {
  message?: string;
}

export function NotImplemented({ isOpen, onClose, message }: NotImplementedProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Feature will be available soon"
      icon={CraneTowerIcon}
      size="md"
      contentPadding={false}
    >
      <ModalContent padding="lg">
        <p className="text-neutral-600 text-sm dark:text-neutral-400">
          {message || "This feature is not implemented yet. We're working on it and it will be available soon!"}
        </p>
      </ModalContent>

      <ModalFooter
        primaryAction={{
          action: onClose,
          label: "Got it",
          variant: "solid",
        }}
      />
    </Modal>
  );
}
