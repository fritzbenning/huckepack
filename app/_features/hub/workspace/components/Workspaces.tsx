import { useCurrentUser } from "@hub/auth";
import { useTeamsByOwner } from "@hub/teams/hooks/useTeamsByOwner";
import { PlusIcon } from "@phosphor-icons/react";
import { openModal } from "@shared/modal";
import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";
import AsideItem from "@shared/ui-kit/ui/AsideItem";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useWorkspaces } from "../hooks/useWorkspaces";

export function Workspaces() {
  const { convexUser } = useCurrentUser();
  const location = useLocation();
  const { workspaces, loading } = useWorkspaces(null);
  const { teams } = useTeamsByOwner(convexUser?._id || null);

  const personalWorkspaceId = useMemo(() => {
    const personalTeam = teams?.find((team) => team.name === "Personal");
    return personalTeam?.workspaceId;
  }, [teams]);

  const filteredWorkspaces = useMemo(() => {
    if (!workspaces) return [];
    return workspaces.filter((workspace) => workspace.id !== personalWorkspaceId);
  }, [workspaces, personalWorkspaceId]);

  if (!convexUser) {
    return null;
  }

  return (
    <AnimatedSkeleton
      loading={loading}
      skeletonItems={2}
      skeletonHeight={52}
      containerClassName="space-y-3"
      itemClassName="h-5 flex-1 mx-2"
      rounded="sm"
    >
      {filteredWorkspaces.length === 0 ? (
        <AsideItem key="no-workspaces" onClick={() => openModal("workspace.new")} icon={PlusIcon} iconWeight="regular">
          Create workspace
        </AsideItem>
      ) : (
        <div className="space-y-1">
          {filteredWorkspaces.map((workspace) => (
            <AsideItem
              key={workspace.id}
              href={`/workspace/${workspace.id}`}
              isActive={location.pathname === `/workspace/${workspace.id}`}
              avatar
            >
              {workspace.name}
            </AsideItem>
          ))}
        </div>
      )}
    </AnimatedSkeleton>
  );
}
