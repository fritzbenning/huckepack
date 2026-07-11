import { Trash } from "@phosphor-icons/react";
import { useAsyncAction } from "@shared/action";
import { Input } from "@shared/ui-kit/inputs/input/Input";
import { Heading } from "@shared/ui-kit/typo";
import Button from "@shared/ui-kit/ui/Button";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProject } from "../hooks/useProject";
import type { Project } from "../types";

interface SettingsProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  navigateOnDelete?: boolean;
}

export function Settings({ projectId, isOpen, onClose, navigateOnDelete = false }: SettingsProps) {
  const [projectName, setProjectName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const { project } = useProject(projectId);

  // Update project name when project data is loaded
  useEffect(() => {
    if (project && isOpen) {
      setProjectName(project.name);
      setOriginalName(project.name);
    }
  }, [project, isOpen]);

  const { action: updateProject, loading: updateLoading } = useAsyncAction("project.update", {
    onSuccess: (result: Project) => {
      setOriginalName(result.name);
      // Convex queries are reactive - no manual cache invalidation needed
      toast.success("Project updated successfully!");
      onClose();
    },
    onError: (error: string) => {
      console.error("Error updating project:", error);
    },
  });

  const { action: deleteProject, loading: deleteLoading } = useAsyncAction("project.delete", {
    onSuccess: () => {
      // Convex queries are reactive - no manual cache invalidation needed
      toast.success("Project deleted successfully!");
      onClose();
      if (navigateOnDelete) {
        navigate(-1);
      }
    },
    onError: (error: string) => {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    },
  });

  const handleUpdateProject = () => {
    if (!projectId || !projectName.trim() || projectName === originalName) {
      return;
    }
    updateProject({
      id: projectId,
      name: projectName.trim(),
    });
  };

  const handleDeleteProject = () => {
    if (!projectId) return;
    deleteProject({ projectId });
  };

  const closeModal = () => {
    onClose();
    setProjectName(originalName);
    setShowDeleteConfirm(false);
  };

  const hasChanges = projectName.trim() !== originalName && projectName.trim().length > 0;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="Project Settings" size="md">
      <div className="py-5">
        <div className="mb-6 px-5">
          <Input
            id="projectName"
            type="text"
            value={projectName}
            onChange={setProjectName}
            placeholder="Enter project name"
            className="w-full"
            instant
            tone="emphasized"
            dimension="large"
            label="Project Name"
          />
        </div>

        <div className="mb-6 px-5">
          <div className="border-neutral-200 border-t pt-6 dark:border-neutral-750">
            <Heading as="h2" variant="h4" className="mb-2">
              Danger Zone
            </Heading>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Deleting this project is permanent. All files and data inside the project will be permanently erased and
              cannot be recovered.
            </p>
            {!showDeleteConfirm ? (
              <Button
                severity="error"
                variant="solid"
                size="large"
                onClick={() => setShowDeleteConfirm(true)}
                icon={Trash}
              >
                Delete Project
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  severity="error"
                  variant="solid"
                  size="large"
                  onClick={handleDeleteProject}
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
          action: handleUpdateProject,
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
