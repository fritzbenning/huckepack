import { Trash } from "@phosphor-icons/react";
import { useAsyncAction } from "@shared/action";
import type { ModalProps } from "@shared/modal/types";
import { Input } from "@shared/ui-kit/inputs/input/Input";
import { Heading } from "@shared/ui-kit/typo";
import Button from "@shared/ui-kit/ui/Button";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useWorkspace } from "../hooks/useWorkspace";
import type { Workspace } from "../types";

interface WorkspaceSettingsModalProps extends ModalProps<"workspace.settings"> {}

export function Settings({ workspaceId, isOpen, onClose }: WorkspaceSettingsModalProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const { workspace, loading: fetching } = useWorkspace(workspaceId);

  // Get workspace data
  useEffect(() => {
    if (workspace) {
      setWorkspaceName(workspace.name);
      setOriginalName(workspace.name);
    }
  }, [workspace]);

  const { action: updateWorkspace, loading: updateLoading } = useAsyncAction("workspace.update", {
    onSuccess: (result: Workspace) => {
      setOriginalName(result.name);
      // Convex queries are reactive - no manual cache invalidation needed
      toast.success("Workspace updated successfully!");
      onClose();
    },
    onError: (error: string) => {
      console.error("Error updating workspace:", error);
      toast.error("Failed to update workspace. Please try again.");
    },
  });

  const { action: deleteWorkspace, loading: deleteLoading } = useAsyncAction("workspace.delete", {
    onSuccess: () => {
      // Convex queries are reactive - no manual cache invalidation needed
      toast.success("Workspace deleted successfully!");
      onClose();
      navigate("/dashboard");
    },
    onError: (error: string) => {
      console.error("Error deleting workspace:", error);
      toast.error("Failed to delete workspace. Please try again.");
    },
  });

  const handleUpdateWorkspace = () => {
    if (!workspaceId || !workspaceName.trim() || workspaceName === originalName) {
      return;
    }
    updateWorkspace({
      id: workspaceId,
      name: workspaceName.trim(),
    });
  };

  const handleDeleteWorkspace = () => {
    if (!workspaceId) return;
    deleteWorkspace({ workspaceId });
  };

  const closeModal = () => {
    onClose();
    setWorkspaceName(originalName);
    setShowDeleteConfirm(false);
  };

  const hasChanges = workspaceName.trim() !== originalName && workspaceName.trim().length > 0;

  if (fetching) {
    return (
      <Modal isOpen={isOpen} onClose={closeModal} title="Workspace Settings">
        <div>Loading...</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="Workspace Settings" size="md">
      <div className="py-5">
        <div className="mb-6 px-5">
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
            label="Workspace Name"
          />
        </div>

        <div className="mb-6 px-5">
          <div className="border-neutral-200 border-t pt-6 dark:border-neutral-750">
            <Heading as="h2" variant="h4" className="mb-2">
              Danger Zone
            </Heading>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Deleting this workspace is permanent. All teams, projects, and data inside the workspace will be
              permanently erased and cannot be recovered.
            </p>
            {!showDeleteConfirm ? (
              <Button
                severity="error"
                variant="solid"
                size="large"
                onClick={() => setShowDeleteConfirm(true)}
                icon={Trash}
              >
                Delete Workspace
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  severity="error"
                  variant="solid"
                  size="large"
                  onClick={handleDeleteWorkspace}
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
          action: handleUpdateWorkspace,
          label: updateLoading ? "Saving..." : "Save Changes",
          disabled: !hasChanges || updateLoading,
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
