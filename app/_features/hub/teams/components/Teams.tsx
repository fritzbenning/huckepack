import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";
import EmptyCard from "@shared/ui-kit/cards/EmptyCard";
import { CardGrid } from "@shared/ui-kit/ui/CardGrid";
import { useEffect } from "react";
import { useTeams } from "../hooks/useTeams";
import TeamCard from "./TeamCard";

interface TeamsProps {
  workspaceId: string | null | undefined;
  createTeamAction: () => void;
  className?: string;
  onReady?: () => void;
}

export function Teams({ workspaceId, createTeamAction, className = "", onReady }: TeamsProps) {
  const { teams, loading } = useTeams(workspaceId);

  useEffect(() => {
    // Call onReady when teams are loaded (not loading anymore)
    if (!loading && onReady) {
      onReady();
    }
  }, [loading, onReady]);

  return (
    <AnimatedSkeleton
      loading={loading}
      skeletonItems={3}
      skeletonHeight={160}
      containerClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-5 2xl:grid-cols-4"
      itemClassName="h-40 w-full"
      rounded="xl"
    >
      <CardGrid className={className}>
        {teams.length > 0
          ? teams.map((team) => <TeamCard key={team._id} teamId={team._id} teamName={team.name} />)
          : null}
        <EmptyCard headline="Add new team" onClick={createTeamAction} weight="regular" />
      </CardGrid>
    </AnimatedSkeleton>
  );
}
