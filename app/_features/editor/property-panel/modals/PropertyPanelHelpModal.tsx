import { SectionTitle } from "@shared/ui-kit/editor/SectionTitle";
import { ModalContainer } from "@shared/ui-kit/ui/ModalContainer";
import { ModalContent } from "@shared/ui-kit/ui/ModalContent";
import { ModalHeader } from "@shared/ui-kit/ui/ModalHeader";
import type { BasePinnedModalProps } from "@shared/pinned-modal/types";

export function PropertyPanelHelpModal({ isOpen, onClose }: BasePinnedModalProps) {
  if (!isOpen) return null;

  return (
    <ModalContainer className="w-80" size="custom">
      <ModalHeader title="What are properties?" onClose={onClose} />
      <ModalContent>
        <p>
          Each UI component can have one or several properties to overwrite content and behavior inside the component.
        </p>
        <p>
          A simple example would be a "Title" property, which value can overwrite the default title of the component.
        </p>
        <p>
          <SectionTitle>Types of properties</SectionTitle>
          Simple text is a string, a boolean is a true-or-false value, a number is a numeric value, and a union is a
          value that can be one of several options.
        </p>
      </ModalContent>
    </ModalContainer>
  );
}
