import type { Id } from "@convex/_generated/dataModel";
import { Trash } from "@phosphor-icons/react";
import { useAsyncAction } from "@shared/action";
import { Input } from "@shared/ui-kit/inputs/input/Input";
import { TagInput } from "@shared/ui-kit/inputs/TagInput";
import { Heading } from "@shared/ui-kit/typo";
import Button from "@shared/ui-kit/ui/Button";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFile } from "../hooks/useFile";
import type { File } from "../types";

interface SettingsProps {
  fileId: Id<"files">;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ fileId, projectId, isOpen, onClose }: SettingsProps) {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isDraft, setIsDraft] = useState(false);
  const [originalData, setOriginalData] = useState<Partial<File>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  // Get file data using the useFile hook
  const { file, loading: fileLoading, error: fileError } = useFile(fileId);

  // Update form state when file data is loaded
  useEffect(() => {
    if (file) {
      setFileName(file.name);
      setFileType(file.type);
      setTags(file.tags || []);
      setIsDraft(file.draft || false);
      setOriginalData(file);
    }
  }, [file]);

  const { action: updateFile, loading: updateLoading } = useAsyncAction("file.update", {
    onSuccess: (result: File) => {
      setOriginalData(result);
      // Convex queries are reactive - no manual cache invalidation needed
      toast.success("File updated successfully!");
      onClose();
    },
    onError: (error: string) => {
      console.error("Error updating file:", error);
      toast.error("Failed to update file. Please try again.");
    },
  });

  const { action: deleteFile, loading: deleteLoading } = useAsyncAction("file.delete", {
    onSuccess: () => {
      // Convex queries are reactive - no manual cache invalidation needed
      toast.success("File deleted successfully!");
      onClose();
      navigate(-1);
    },
    onError: (error: string) => {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file. Please try again.");
    },
  });

  const handleUpdateFile = () => {
    if (!fileId || !fileName.trim()) {
      return;
    }
    updateFile({
      id: fileId,
      name: fileName.trim(),
      type: fileType.trim(),
      tags,
      draft: isDraft,
    });
  };

  const handleDeleteFile = () => {
    if (!fileId) return;
    deleteFile({ fileId, projectId });
  };

  const closeModal = () => {
    onClose();
    if (file) {
      setFileName(file.name);
      setFileType(file.type);
      setTags(file.tags || []);
      setIsDraft(file.draft || false);
    }
    setShowDeleteConfirm(false);
  };

  const hasChanges =
    fileName.trim() !== (originalData.name || "") ||
    fileType.trim() !== (originalData.type || "") ||
    JSON.stringify(tags) !== JSON.stringify(originalData.tags || []) ||
    isDraft !== (originalData.draft || false);

  // Show loading state
  if (fileLoading) {
    return (
      <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="File Settings" size="md">
        <div className="px-5 py-5">
          <div className="flex h-32 items-center justify-center">
            <div className="text-neutral-600 dark:text-neutral-400">Loading file...</div>
          </div>
        </div>
      </Modal>
    );
  }

  // Show error state
  if (fileError) {
    return (
      <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="File Settings" size="md">
        <div className="px-5 py-5">
          <div className="flex h-32 flex-col items-center justify-center">
            <div className="mb-2 text-red-600 dark:text-red-400">Error loading file</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">{fileError}</div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="File Settings" size="md">
      <div className="py-5">
        <div className="mb-6 px-5">
          <Input
            id="fileName"
            type="text"
            value={fileName}
            onChange={setFileName}
            placeholder="Enter file name"
            className="w-full"
            instant
            tone="emphasized"
            dimension="large"
            label="File Name"
          />
        </div>

        <div className="mb-6 px-5">
          <Input
            id="fileType"
            type="text"
            value={fileType}
            onChange={setFileType}
            placeholder="Enter file type (e.g., tsx, ts, css)"
            className="w-full"
            instant
            tone="emphasized"
            dimension="large"
            label="File Type"
          />
        </div>

        <div className="mb-6 px-5">
          <TagInput value={tags} onChange={setTags} placeholder="Add tags..." label="Tags" />
        </div>

        <div className="mb-6 px-5">
          <div className="border-neutral-200 border-t pt-6 dark:border-neutral-750">
            <Heading as="h2" variant="h4" className="mb-2">
              Danger Zone
            </Heading>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Deleting this file will permanently remove it and all its versions. This action cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <Button
                severity="error"
                variant="solid"
                size="large"
                onClick={() => setShowDeleteConfirm(true)}
                icon={Trash}
              >
                Delete File
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  severity="error"
                  variant="solid"
                  size="large"
                  onClick={handleDeleteFile}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Confirm Deletion"}
                </Button>
                <Button variant="outline" size="large" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalFooter
        primaryAction={{
          action: handleUpdateFile,
          label: updateLoading ? "Saving..." : "Save Changes",
          disabled: !hasChanges || !fileName.trim() || updateLoading,
        }}
        secondaryAction={{
          action: closeModal,
          label: "Cancel",
          variant: "outline",
        }}
      />
    </Modal>
  );
}
