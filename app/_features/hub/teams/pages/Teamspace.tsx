import type { Id } from "@convex/_generated/dataModel";
import { HubPage, HubPageHeader } from "@hub/layout";
import { Projects } from "@hub/projects/components";
import { useWorkspace } from "@hub/workspace/hooks/useWorkspace";
import { Gear, Plus } from "@phosphor-icons/react";
import { useScopeLoading } from "@shared/hooks/useScopeLoading";
import { openModal } from "@shared/modal";
import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";
import { Heading } from "@shared/ui-kit/typo";
import Button from "@shared/ui-kit/ui/Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTeam } from "../hooks/useTeam";

export default function Team() {
  const { teamId } = useParams<{ teamId: string }>();
  const { team, loading: teamLoading } = useTeam(teamId);
  const { workspace, loading: workspaceLoading } = useWorkspace(team?.workspaceId);

  const [projectsLoading, setProjectsLoading] = useState(true);

  // Reset loading state when teamId changes
  useEffect(() => {
    setProjectsLoading(true);
  }, [teamId]);

  const scopeLoading = useScopeLoading([teamLoading, workspaceLoading, projectsLoading]);

  return (
    <HubPage loading={scopeLoading} loadingLabel="Gathering team projects ...">
      <HubPageHeader
        breadcrumbItems={[
          {
            label: workspace?.name || "",
            href: `/workspace/${team?.workspaceId}`,
          },
          {
            label: team?.name || "Team",
          },
        ]}
        loading={scopeLoading}
      >
        {/* <Select
          options={[
            { value: "alphabetical", label: "Alphabetical" },
            { value: "date created", label: "Date created" },
            { value: "last updated", label: "Last updated" },
          ]}
          value="alphabetical"
          onChange={() => {}}
          tone="transparent"
          x="left"
          y="bottom"
        /> */}
        <div className="flex items-center gap-2">
          <Button
            size="large"
            icon={Plus}
            onClick={() => teamId && openModal("project.new", { teamId: teamId as Id<"teams"> })}
          >
            Project
          </Button>
          <Button
            size="large"
            icon={Gear}
            onClick={() => teamId && openModal("team.settings", { teamId, navigateOnDelete: true })}
            iconOnly
          />
        </div>
      </HubPageHeader>
      <div className="flex flex-col gap-9">
        <AnimatedSkeleton loading={teamLoading} skeletonHeight={28} itemClassName="h-7.5 w-48" rounded="sm">
          <Heading as="h1" variant="h1" className="text-neutral-850 dark:text-neutral-200">
            {team?.name}
          </Heading>
        </AnimatedSkeleton>
        {teamId && (
          <Projects
            teamId={teamId as Id<"teams">}
            createProjectAction={() => openModal("project.new", { teamId: teamId as Id<"teams"> })}
            onReady={() => setProjectsLoading(false)}
          />
        )}
      </div>
    </HubPage>
  );
}
