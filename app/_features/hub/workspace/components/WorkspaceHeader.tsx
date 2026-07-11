import { useCurrentUser } from "@hub/auth";
import { HubPageHeader } from "@hub/layout";
import { Gear, Plus } from "@phosphor-icons/react";
import { openModal } from "@shared/modal";
import Button from "@shared/ui-kit/ui/Button";
import ButtonGroup from "@shared/ui-kit/ui/ButtonGroup";
import { useWorkspace } from "../hooks/useWorkspace";

export function WorkspaceHeader({ workspaceId, personal }: { workspaceId: string | undefined; personal?: boolean }) {
  const { convexUser } = useCurrentUser();
  const { workspace } = useWorkspace(personal ? convexUser?._id : workspaceId);

  return (
    <HubPageHeader
      breadcrumbItems={
        personal
          ? [
              {
                label: "Personal workspace",
              },
            ]
          : workspace?.name
            ? [
                {
                  label: workspace?.name,
                },
              ]
            : undefined
      }
      loading={!workspace?.name}
    >
      <ButtonGroup>
        <Button size="large" icon={Plus} onClick={() => openModal("team.new", { workspaceId })}>
          Team
        </Button>
        {!personal && (
          <Button
            size="large"
            icon={Gear}
            onClick={() => workspaceId && openModal("workspace.settings", { workspaceId })}
            iconOnly
          />
        )}
      </ButtonGroup>
    </HubPageHeader>
  );
}
