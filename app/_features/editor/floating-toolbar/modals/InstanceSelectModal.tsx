import { Combobox } from "@shared/ui-kit/inputs/combobox/Combobox";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { Diamond } from "@phosphor-icons/react";
import { useStoreFiles } from "@project/file-manager";
import type { BaseModalProps } from "@shared/modal/types";
import { useMemo } from "react";

interface InstanceSelectModalProps extends BaseModalProps {
  projectId: string;
  currentFileId: string;
  onSelect: (componentFileId: string) => void;
}

export function InstanceSelectModal({ isOpen, onClose, projectId, currentFileId, onSelect }: InstanceSelectModalProps) {
  const allFiles = useStoreFiles(projectId);

  // Filter components: exclude current file and only include files with exports
  const availableComponents = useMemo(() => {
    return allFiles
      .filter((file) => {
        // Exclude current file
        if (file.id === currentFileId) return false;
        // Only include files that have an export (component files)
        if (!file.export) return false;
        return true;
      })
      .map((file) => ({
        value: file.id,
        label: file.name,
        description: file.path,
      }));
  }, [allFiles, currentFileId]);

  const handleSelect = (fileId: string) => {
    onSelect(fileId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Component" icon={Diamond} size="lg">
      <div className="flex flex-col gap-4">
        <Combobox
          options={availableComponents}
          value={undefined}
          onValueChange={handleSelect}
          placeholder="Search components..."
          emptyText="No components found"
          aria-label="Component selector"
        />
      </div>
    </Modal>
  );
}
