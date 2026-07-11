import { Input } from "@shared/ui-kit/inputs/input/Input";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";
import type { Id } from "@convex/_generated/dataModel";
import { useAsyncAction } from "@shared/action";
import { useState } from "react";
import type { Project } from "../types";

interface NewProps {
  teamId?: Id<"teams">;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (projectId: string) => void;
}

export function New({ teamId, isOpen, onClose, onSuccess }: NewProps) {
  const [projectName, setProjectName] = useState("");

  const { action: createProject, loading } = useAsyncAction("project.create", {
    onSuccess: (result: Project) => {
      setProjectName("");
      onClose();
      if (onSuccess) {
        onSuccess(result.id);
      }
    },
    onError: (error: string) => {
      console.error("Error creating project:", error);
    },
  });

  const handleCreateProject = () => {
    if (!teamId || !projectName.trim()) {
      return;
    }
    createProject({
      name: projectName.trim(),
      teamId: String(teamId),
    });
  };

  const closeModal = () => {
    onClose();
    setProjectName("");
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="New Project" size="md">
      <div className="py-5">
        <div className="mb-5 px-5">
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
            label="Name"
          />
        </div>
      </div>
      <ModalFooter
        primaryAction={{
          action: handleCreateProject,
          label: loading ? "Creating..." : "Create Project",
          disabled: !projectName.trim() || loading,
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
