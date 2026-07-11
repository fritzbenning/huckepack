import { HubPage, HubPageHeader } from "@hub/layout";
import { Projects } from "@hub/projects/components";
import { PlusIcon } from "@phosphor-icons/react";
import { openModal } from "@shared/modal";
import { Heading } from "@shared/ui-kit/typo";
import Button from "@shared/ui-kit/ui/Button";
import { useCurrentUser } from "../../auth";
import { useTeamsByOwner } from "../../teams/hooks/useTeamsByOwner";

export default function Teamspace() {
  const { convexUser } = useCurrentUser();
  const { personalTeamId, isLoading: teamsLoading } = useTeamsByOwner(convexUser?._id || null);

  if (!convexUser) {
    return null;
  }

  return (
    <HubPage loading={!convexUser || teamsLoading}>
      <HubPageHeader
        breadcrumbItems={[
          {
            label: "Personal projects",
            href: personalTeamId ? `/team/${personalTeamId}` : undefined,
          },
        ]}
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
        {/* <Input icon="search" value={search} onChange={setSearch} placeholder="Search" dimension="large" instant className="w-56" /> */}
        <div className="flex items-center gap-2">
          <Button
            size="large"
            icon={PlusIcon}
            onClick={() => personalTeamId && openModal("project.new", { teamId: personalTeamId })}
            iconWeight="regular"
            disabled={!personalTeamId}
          >
            Project
          </Button>
        </div>
      </HubPageHeader>
      <div className="flex flex-col gap-9">
        <Heading as="h1" variant="h1" className="text-neutral-850 dark:text-neutral-200">
          {/* {team?.name} */}
          Your personal projects
        </Heading>
        <Projects
          teamId={personalTeamId ?? undefined}
          createProjectAction={() => personalTeamId && openModal("project.new", { teamId: personalTeamId })}
        />
      </div>
    </HubPage>
  );
}
