import { Input } from "@shared/ui-kit/inputs/input/Input";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";
import { useAsyncAction } from "@shared/action";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Team } from "../types";

interface NewProps {
  workspaceId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function New({ workspaceId, isOpen, onClose }: NewProps) {
  const [teamName, setTeamName] = useState("");

  const { action: createTeam, loading } = useAsyncAction("team.create", {
    onSuccess: (result: { team: Team }) => {
      setTeamName("");
      onClose();
      //navigate(`/team/${result.team.id}`);
    },
    onError: (error: string) => {
      console.error("Error creating team:", error);
    },
  });

  const handleCreateTeam = () => {
    if (!workspaceId) {
      return;
    }
    createTeam({ name: teamName, workspaceId });
  };

  const closeModal = () => {
    onClose();
    setTeamName("");
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="New Team" size="md">
      <div className="py-5">
        <div className="mb-5 px-5">
          <Input
            id="teamName"
            type="text"
            value={teamName}
            onChange={setTeamName}
            placeholder="Enter team name"
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
          action: handleCreateTeam,
          label: loading ? "Creating..." : "Create Team",
          disabled: !teamName.trim() || loading,
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
