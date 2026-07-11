import { Input } from "@shared/ui-kit/inputs/input/Input";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";
import { useAsyncAction } from "@shared/action";
import type { ModalProps } from "@shared/modal/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface WorkspaceNewModalProps extends ModalProps<"workspace.new"> {}

export function New({ isOpen, onClose }: WorkspaceNewModalProps) {
  const [workspaceName, setWorkspaceName] = useState("");

  const navigate = useNavigate();

  const { action: createWorkspace, loading } = useAsyncAction("workspace.create", {
    onSuccess: (result: { workspaceId: string }) => {
      setWorkspaceName("");
      onClose();
      navigate(`/workspace/${result.workspaceId}`);
    },
    onError: (error: string) => {
      console.error("Error creating workspace:", error);
    },
  });

  const handleCreateWorkspace = () => {
    createWorkspace({ name: workspaceName });
  };

  const closeModal = () => {
    onClose();
    setWorkspaceName("");
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="New Workspace" size="md">
      <div className="py-5">
        <div className="mb-5 px-5">
          <Input
            id="workspaceName"
            type="text"
            value={workspaceName}
            onChange={setWorkspaceName}
            placeholder="Enter workspace name"
            className="w-full"
            instant
            tone="emphasized"
            dimension="large"
            label="Name"
          />
        </div>
      </div>
      <ModalFooter
        primaryAction={{
          action: handleCreateWorkspace,
          label: loading ? "Creating..." : "Create Workspace",
          disabled: !workspaceName.trim() || loading,
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
