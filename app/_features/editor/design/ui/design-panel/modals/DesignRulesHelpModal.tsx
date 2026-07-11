import type { BasePinnedModalProps } from "@shared/pinned-modal/types";
import { SectionTitle } from "@shared/ui-kit/editor/SectionTitle";
import { ModalContainer } from "@shared/ui-kit/ui/ModalContainer";
import { ModalContent } from "@shared/ui-kit/ui/ModalContent";
import { ModalHeader } from "@shared/ui-kit/ui/ModalHeader";

export function DesignRulesHelpModal({ isOpen, onClose }: BasePinnedModalProps) {
  if (!isOpen) return null;

  return (
    <ModalContainer className="w-80" size="custom">
      <ModalHeader title="What are design propertys?" onClose={onClose} />
      <ModalContent>
        <p>Design rules allow you to define consistent styling patterns and constraints for your components.</p>
        <p>
          These rules help maintain visual consistency across your design system and ensure components follow your
          design guidelines.
        </p>
        <p>
          <SectionTitle>Types of design propertys</SectionTitle>
          Design rules can define spacing, colors, typography, and other design tokens that components should follow.
        </p>
      </ModalContent>
    </ModalContainer>
  );
}
