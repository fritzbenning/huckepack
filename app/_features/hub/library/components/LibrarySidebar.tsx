import { ProjectName, useProject } from "@hub/projects";
import { Files, GithubLogo } from "@phosphor-icons/react";
import { openModal } from "@shared/modal";
import { AnimatedSuspense } from "@shared/ui-kit/animations/AnimatedSuspense";
import { Aside } from "@shared/ui-kit/layout/Aside";
import { AsideDivider } from "@shared/ui-kit/layout/AsideDivider";
import { AsideHeader } from "@shared/ui-kit/layout/AsideHeader";
import { AsideHeaderContent } from "@shared/ui-kit/layout/AsideHeaderContent";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import AsideItem from "@shared/ui-kit/ui/AsideItem";
import Button from "@shared/ui-kit/ui/Button";
import { Jumbotron } from "@shared/ui-kit/ui/Jumbotron";

export function LibrarySidebar({ projectId }: { projectId: string }) {
  const { teamId } = useProject(projectId);

  return (
    <Aside position="left" layout="auto" fixedWidth={true} className="pb-4">
      <AsideHeader>
        <AsideHeaderContent projectId={projectId} goBackTarget={teamId ? `/team/${teamId}` : undefined} />
      </AsideHeader>
      <AsideSection>
        <AnimatedSuspense itemClassName="h-3.75 w-32" rounded="md">
          <ProjectName projectId={projectId} />
        </AnimatedSuspense>
      </AsideSection>
      <AsideSection
        title="Saved in Trav"
        onAction={() => openModal("application.notImplemented")}
        indentedContent={false}
      >
        <AsideItem icon={Files} isActive={true}>
          All files
        </AsideItem>
      </AsideSection>
      <AsideDivider />
      <AsideSection title="Synced with repository">
        <Jumbotron className="flex flex-col gap-3" padding="medium">
          <p className="font-medium text-xs text-neutral-500 leading-snug dark:text-neutral-400">
            Edit React components directly from your code base.
          </p>
          <Button onClick={() => openModal("repo.connect")} icon={GithubLogo} className="w-full">
            Connect to Github
          </Button>
        </Jumbotron>
      </AsideSection>
    </Aside>
  );
}
