import type { Id } from "@convex/_generated/dataModel";
import { SandpackInstance } from "@editor/sandpack";
import { useProject } from "@hub/projects";
import { useTeam } from "@hub/teams";
import { FilePlusIcon, GearIcon, List, PlusIcon, SquaresFour } from "@phosphor-icons/react";
import { FilesGridView, FilesListView } from "@project/file";
import { useScopeLoading } from "@shared/hooks/useScopeLoading";
import { openModal } from "@shared/modal";
import { IconTabs } from "@shared/ui-kit/editor/ui/IconTabs";
import { Heading } from "@shared/ui-kit/typo";
import Button from "@shared/ui-kit/ui/Button";
import ButtonGroup from "@shared/ui-kit/ui/ButtonGroup";
import { Activity, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LibraryPage } from "../components/LibraryPage";
import { LibraryPageHeader } from "../components/LibraryPageHeader";
import { useFileView } from "../hooks/useFileView";
import { setCurrentProjectId } from "../stores/libraryStore";

export default function Library() {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, teamId, loading: projectLoading } = useProject(projectId);
  const { team, loading: teamLoading } = useTeam(teamId ?? null);
  const { view, setView } = useFileView();

  const scopeLoading = useScopeLoading([projectLoading, teamLoading]);

  useEffect(() => {
    setCurrentProjectId(projectId!);
  }, [projectId]);

  return (
    <LibraryPage loading={scopeLoading}>
      <LibraryPageHeader
        loading={scopeLoading}
        workspaceId={team?.workspaceId ?? null}
        teamId={teamId ?? null}
        projectName={project?.name}
      >
        <ButtonGroup>
          <Button size="large" icon={FilePlusIcon} onClick={() => openModal("application.notImplemented")}>
            Page
          </Button>
          <Button
            size="large"
            icon={PlusIcon}
            onClick={() => projectId && openModal("file.new", { projectId: projectId })}
            iconWeight="regular"
          >
            File
          </Button>
          <Button
            size="large"
            icon={GearIcon}
            onClick={() => projectId && openModal("project.settings", { projectId: projectId, navigateOnDelete: true })}
            iconOnly
          />
        </ButtonGroup>
      </LibraryPageHeader>
      <div className="flex h-full flex-col gap-9">
        <div className="flex items-center justify-between">
          <Heading as="h1" variant="h1" className="text-neutral-850 dark:text-neutral-200">
            Library
          </Heading>
          <IconTabs
            items={[
              { value: "list", icon: List, label: "List view" },
              { value: "grid", icon: SquaresFour, label: "Grid view" },
            ]}
            activeValue={view}
            onChange={setView}
            size="medium"
          />
        </div>

        <Activity mode={view === "list" ? "visible" : "hidden"}>
          <FilesListView projectId={projectId} />
        </Activity>
        <Activity mode={view === "grid" ? "visible" : "hidden"}>
          <SandpackInstance projectId={projectId as Id<"projects">} key={`runtime-${projectId}`}>
            <FilesGridView projectId={projectId} />
          </SandpackInstance>
        </Activity>
      </div>
    </LibraryPage>
  );
}
