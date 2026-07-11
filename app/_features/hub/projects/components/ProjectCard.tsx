import { usePinnedItems } from "@hub/pinned-items";
import { Gear, PushPin, PushPinSlash } from "@phosphor-icons/react";
import { executeAction } from "@shared/action";
import { openModal } from "@shared/modal";
import CardTeaser from "@shared/ui-kit/cards/CardTeaser";
import InitialsAvatar from "@shared/ui-kit/ui/InitialsAvatar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import { prepareProjectRoute } from "../services/prepareProjectRoute";

export interface ProjectCardProps {
  projectName: string;
  projectId: string;
  buttonLabel?: string;
  className?: string;
  demo?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  projectId,
  buttonLabel = "Open project",
  demo = false,
  className = "",
}) => {
  // prefetching the project data
  useProject(projectId);

  const { pinnedItems } = usePinnedItems();
  const navigate = useNavigate();

  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (pinnedItems === undefined) {
      return;
    }

    setIsPinned(
      pinnedItems.some((item) => item.pinnedItem.entityType === "project" && item.pinnedItem.entityId === projectId)
    );
  }, [pinnedItems, projectId]);

  const handlePinClick = () => {
    if (!projectId) {
      console.error("Cannot pin/unpin: projectId is missing");
      return;
    }

    executeAction(isPinned ? "hub.unpin" : "hub.pin", {
      entity_type: "project",
      entity_id: projectId,
      entity: {
        name: projectName,
      },
    });
  };

  const handleOpenProject = () => {
    const route = prepareProjectRoute(projectId);
    navigate(route);
  };

  return (
    <CardTeaser
      head={<InitialsAvatar name={projectName} size="lg" />}
      headline={projectName}
      // subline={repoName}
      // sublineIcon={Github}
      buttonLabel={buttonLabel}
      onClick={handleOpenProject}
      variant="draft"
      className={className}
      actions={
        demo ? null : (
          <>
            <button
              type="button"
              className="size-4 py-1 text-neutral-400 opacity-0 transition-all hover:text-primary-500 group-hover:opacity-100 dark:text-neutral-400 dark:hover:text-neutral-100"
              onClick={() => openModal("project.settings", { projectId })}
            >
              <Gear className="size-4" weight="duotone" />
            </button>
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
          </>
        )
      }
    />
  );
};

export default ProjectCard;
