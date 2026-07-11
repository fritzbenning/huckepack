import { useTeam } from "@hub/teams";
import { useWorkspace } from "@hub/workspace";
import Breadcrumb from "@shared/ui-kit/ui/Breadcrumb";
import { type ReactNode, useMemo } from "react";

interface LibraryPageHeaderProps {
  workspaceId?: string | null;
  teamId?: string | null;
  projectName?: string;
  children?: ReactNode;
  loading?: boolean;
}

export function LibraryPageHeader({ workspaceId, teamId, projectName, children }: LibraryPageHeaderProps) {
  const { workspace } = useWorkspace(workspaceId ?? null);
  const { team, loading } = useTeam(teamId ?? null);

  const breadcrumbItems = useMemo(() => {
    return [
      {
        label: workspace?.name ?? "",
        href: workspace?._id ? `/workspace/${workspace._id}` : undefined,
      },
      {
        label: team?.name ?? "",
        href: team?._id ? `/team/${team._id}` : undefined,
      },
      {
        label: projectName ?? "",
      },
    ];
  }, [workspace?.name, workspace?._id, team?.name, team?._id, projectName]);

  return (
    <div className="flex items-center justify-between gap-4">
      <Breadcrumb items={breadcrumbItems} loading={loading} />
      {children && <div className="flex items-center gap-4">{children}</div>}
    </div>
  );
}
