import { SectionTitle } from "@shared/ui-kit/editor/SectionTitle";
import { ModalContainer } from "@shared/ui-kit/ui/ModalContainer";
import { ModalContent } from "@shared/ui-kit/ui/ModalContent";
import { ModalHeader } from "@shared/ui-kit/ui/ModalHeader";
import type { BasePinnedModalProps } from "@shared/pinned-modal/types";

export function FileTreeHelpModal({ isOpen, onClose }: BasePinnedModalProps) {
  if (!isOpen) return null;

  return (
    <ModalContainer className="w-80" size="custom">
      <ModalHeader title="File Tree" onClose={onClose} />
      <ModalContent>
        <p>
          The file tree displays all files in your project, organized by type. You can navigate between files by clicking
          on them.
        </p>
        <p>
          <SectionTitle>Adding files</SectionTitle>
          Use the buttons in the footer to add new Files, Pages, or Canvases to your project.
        </p>
        <p>
          <SectionTitle>File types</SectionTitle>
          Files are organized by their type. Each type represents a different kind of component or resource in your
          project.
        </p>
      </ModalContent>
    </ModalContainer>
  );
}

