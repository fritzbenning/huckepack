import { useCurrentUser } from "@hub/auth";
import { HubPage, HubPageHeader } from "@hub/layout";
import { prepareProjectRoute } from "@hub/projects/services/prepareProjectRoute";
import { useTeamsByOwner } from "@hub/teams/hooks/useTeamsByOwner";
import { ChatCircleIcon, FileIcon, MagicWandIcon, UsersThreeIcon } from "@phosphor-icons/react";
import { openModal } from "@shared/modal";
import EmptyCard from "@shared/ui-kit/cards/EmptyCard";
import { Heading } from "@shared/ui-kit/typo";
import Button from "@shared/ui-kit/ui/Button";
import ButtonGroup from "@shared/ui-kit/ui/ButtonGroup";
import { CardGrid } from "@shared/ui-kit/ui/CardGrid";
import { JumbotronSection } from "@shared/ui-kit/ui/JumbotronSection";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const { convexUser } = useCurrentUser();
  const { personalTeamId } = useTeamsByOwner(convexUser?._id || null);

  return (
    <HubPage>
      <HubPageHeader>
        <ButtonGroup>
          <Button
            size="large"
            icon={ChatCircleIcon}
            onClick={() =>
              openModal("application.notImplemented", {
                message: "Feedback is not implemented yet. We're working on it!",
              })
            }
          >
            Feedback
          </Button>
          <Button
            size="large"
            onClick={() =>
              openModal("application.notImplemented", {
                message: "Support is not implemented yet. We're working on it!",
              })
            }
          >
            Support
          </Button>
        </ButtonGroup>
      </HubPageHeader>
      <div className="flex flex-col gap-9">
        <JumbotronSection
          headline="Dashboard"
          illustration="rocket"
          gradientBorder
          jumbotronClassName="flex flex-col gap-6"
        >
          <Heading as="h2" variant="h3">
            Welcome to huckepack. Let's create!
          </Heading>
          <CardGrid>
            {/* <ProjectCard
              projectId="e-commerce-playground"
              projectName="E-Commerce Playground"
              buttonLabel="Open demo project"
              demo
            /> */}
            <EmptyCard
              headline="Imagine project"
              onClick={() => navigate("/imagine")}
              icon={MagicWandIcon}
              weight="light"
            />
            <EmptyCard
              headline="New personal project"
              onClick={() =>
                personalTeamId &&
                openModal("project.new", {
                  teamId: personalTeamId,
                  onSuccess: (projectId) => {
                    const route = prepareProjectRoute(projectId);
                    navigate(route);
                  },
                })
              }
              icon={FileIcon}
              weight="light"
            />
            <EmptyCard
              headline="New workspace"
              onClick={() => openModal("workspace.new")}
              icon={UsersThreeIcon}
              weight="light"
            />
          </CardGrid>
        </JumbotronSection>
        <JumbotronSection headline="Academy" illustration="university">
          We are working on the academy content. Stay tuned!
        </JumbotronSection>
      </div>
    </HubPage>
  );
}
