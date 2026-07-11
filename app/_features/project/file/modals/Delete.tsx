import type { Id } from "@convex/_generated/dataModel";
import { TrashSimpleIcon } from "@phosphor-icons/react";
import { navigateAfterFileDeletion } from "@project/file/services/navigateAfterFileDeletion";
import { useStoreFile } from "@project/file-manager";
import { useAsyncAction } from "@shared/action";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalContent } from "@shared/ui-kit/ui/ModalContent";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DeleteProps {
  fileId: Id<"files">;
  projectId: Id<"projects">;
  isOpen: boolean;
  onClose: () => void;
  navigateTo?: "library" | "first-file";
}

export function Delete({ fileId, projectId, isOpen, onClose, navigateTo = "first-file" }: DeleteProps) {
  const navigate = useNavigate();
  const { file } = useStoreFile(fileId, projectId);

  const { action: deleteFile, loading: deleteLoading } = useAsyncAction("file.delete", {
    onSuccess: () => {
      toast.success("File deleted successfully!");
    },
    onError: (error: string) => {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file. Please try again.");
    },
  });

  const handleDeleteFile = () => {
    if (!fileId) return;
    navigateAfterFileDeletion(navigate, projectId, navigateTo);
    onClose();
    deleteFile({ fileId, projectId });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentPadding={false} title="Delete File" size="md">
      <ModalContent padding="lg">
        <p className="mb-2 text-neutral-600 text-sm dark:text-neutral-400">
          Are you sure you want to delete{" "}
          <strong className="font-semibold text-neutral-950 dark:text-neutral-100">{file?.name}</strong>? This will
          permanently remove the file and all its versions.
        </p>
        <p className="text-neutral-600 text-sm dark:text-neutral-400">This action cannot be undone.</p>
      </ModalContent>

      <ModalFooter
        primaryAction={{
          action: handleDeleteFile,
          label: deleteLoading ? "Deleting..." : "Delete File",
          icon: TrashSimpleIcon,
          severity: "error",
          variant: "solid",
          disabled: deleteLoading,
        }}
        secondaryAction={{
          action: onClose,
          label: "Keep",
          variant: "outline",
        }}
      />
    </Modal>
  );
}
