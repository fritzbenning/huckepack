import { Input } from "@shared/ui-kit/inputs/input/Input";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";
import { useAsyncAction } from "@shared/action";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { File } from "../types";

interface NewProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function New({ projectId, isOpen, onClose }: NewProps) {
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const { action: createFile, loading } = useAsyncAction("file.create", {
    onSuccess: (result: File) => {
      // Convex queries are reactive - no manual cache invalidation needed
      toast.success("File created successfully!");
      resetForm();
      onClose();
      //navigate(`/project/${projectId}/file/${result.id}`);
    },
    onError: (error: string) => {
      console.error("Error creating file:", error);
      toast.error("Failed to create file. Please try again.");
    },
  });

  const handleCreateFile = () => {
    if (!projectId || !fileName.trim()) {
      return;
    }

    createFile({
      name: fileName.trim(),
      projectId,
    });
  };

  const resetForm = () => {
    setFileName("");
  };

  const closeModal = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="New File" size="md">
      <div className="py-5">
        <div className="mb-5 px-5">
          <Input
            ref={inputRef}
            id="fileName"
            type="text"
            value={fileName}
            onChange={setFileName}
            placeholder="Enter file name (e.g., Button.tsx)"
            className="w-full"
            instant
            tone="emphasized"
            dimension="large"
            label="File Name"
          />
        </div>

      </div>
      <ModalFooter
        primaryAction={{
          action: handleCreateFile,
          label: loading ? "Creating..." : "Create File",
          disabled: !fileName.trim() || loading,
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
