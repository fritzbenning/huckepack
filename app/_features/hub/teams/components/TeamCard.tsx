import { useUserImages } from "@hub/auth";
import { usePinnedItems } from "@hub/pinned-items";
import { PushPin, PushPinSlash, Users } from "@phosphor-icons/react";
import { executeAction } from "@shared/action";
import CardTeaser from "@shared/ui-kit/cards/CardTeaser";
import UserAvatars from "@shared/ui-kit/ui/UserAvatars";
import { useEffect, useState } from "react";
import { useTeamMembers } from "../hooks/useTeamMembers";

export interface TeamCardProps {
  teamId: string;
  teamName: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamId, teamName }) => {
  const { teamMembers } = useTeamMembers(teamId);
  const { users } = useUserImages(teamMembers || null);
  const { pinnedItems } = usePinnedItems();

  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (pinnedItems === undefined) {
      return;
    }

    setIsPinned(
      pinnedItems.some((item) => item.pinnedItem.entityType === "team" && item.pinnedItem.entityId === teamId)
    );
  }, [pinnedItems, teamId]);

  const handlePinClick = () => {
    if (!teamId) {
      console.error("Cannot pin/unpin: teamId is missing");
      return;
    }

    executeAction(isPinned ? "hub.unpin" : "hub.pin", {
      entity_type: "team",
      entity_id: teamId,
      entity: {
        name: teamName,
      },
    });
  };

  return (
    <CardTeaser
      head={<UserAvatars users={users} size="lg" />}
      headline={teamName}
      headlineIcon={Users}
      buttonLabel="Open team projects"
      href={`/team/${teamId}`}
      actions={
        <button
          type="button"
          className="size-4 py-1 text-neutral-400 opacity-0 transition-all hover:text-primary-500 group-hover:opacity-100 dark:text-neutral-400 dark:hover:text-neutral-100"
          onClick={handlePinClick}
          title={isPinned ? "Unpin project" : "Pin project"}
        >
          {isPinned ? (
            <PushPinSlash className="size-4" weight="duotone" />
          ) : (
            <PushPin className="size-4" weight="duotone" />
          )}
        </button>
      }
    />
  );
};

export default TeamCard;
