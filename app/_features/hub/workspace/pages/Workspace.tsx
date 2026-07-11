import { HubPage } from "@hub/layout";
import { Teams } from "@hub/teams";
import { openModal } from "@shared/modal";
import { Heading } from "@shared/ui-kit/typo";
import { useParams } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { WorkspaceHeading } from "../components/WorkspaceHeading";

export default function Workspace({ personal }: { personal?: boolean }) {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  return (
    <HubPage>
      <WorkspaceHeader workspaceId={workspaceId} personal={personal} />
      <div className="flex flex-col gap-9">
        {personal ? (
          <Heading as="h1" variant="h1" className="text-neutral-850 dark:text-neutral-200">
            Personal workspace
          </Heading>
        ) : (
          <WorkspaceHeading workspaceId={workspaceId} />
        )}
        <Teams workspaceId={workspaceId} createTeamAction={() => openModal("team.new", { workspaceId })} />
      </div>
    </HubPage>
  );
}
