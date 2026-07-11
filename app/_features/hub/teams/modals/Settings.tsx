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
import { useTeam } from "../hooks/useTeam";
import type { Team } from "../types";

interface SettingsProps {
  teamId: string;
  isOpen: boolean;
  onClose: () => void;
  navigateOnDelete?: boolean;
}

export function Settings({ teamId, isOpen, onClose, navigateOnDelete = false }: SettingsProps) {
  const navigate = useNavigate();
  const { team } = useTeam(teamId);

  const [teamName, setTeamName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (team?.name && isOpen) {
      setTeamName(team.name);
    }
  }, [team?.name, isOpen]);

  const { action: updateTeam, loading: updateLoading } = useAsyncAction("team.update", {
    onSuccess: (_result: Team) => {
      toast.success("Team updated successfully!");
      onClose();
    },
    onError: (error: string) => {
      console.error("Error updating team:", error);
    },
  });

  const { action: deleteTeam, loading: deleteLoading } = useAsyncAction("team.delete", {
    onSuccess: () => {
      // Convex queries are reactive - no manual cache invalidation needed
      toast.success("Team deleted successfully!");
      onClose();
    },
    onError: (error: string) => {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team. Please try again.");
    },
  });

  const handleUpdateTeam = () => {
    if (!teamId || !teamName.trim() || teamName === team?.name) {
      return;
    }
    updateTeam({
      id: teamId,
      name: teamName.trim(),
    });
  };

  const handleDeleteTeam = () => {
    if (!teamId) return;
    if (navigateOnDelete) {
      navigate(-1);
    }
    deleteTeam({ teamId });
  };

  const closeModal = () => {
    onClose();
    setTeamName(team?.name ?? "");
    setShowDeleteConfirm(false);
  };

  const hasChanges = teamName.trim() !== team?.name && teamName.trim().length > 0;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="Team Settings" size="md">
      <div className="py-5">
        <div className="mb-6 px-5">
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
            label="Team Name"
          />
        </div>

        <div className="mb-6 px-5">
          <div className="border-neutral-200 border-t pt-6 dark:border-neutral-750">
            <Heading as="h2" variant="h4" className="mb-2">
              Danger Zone
            </Heading>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Deleting this team is permanent. All projects and data inside the team will be permanently erased and
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
                Delete Team
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  severity="error"
                  variant="solid"
                  size="large"
                  onClick={handleDeleteTeam}
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
          action: handleUpdateTeam,
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
