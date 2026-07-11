import type { Id } from "@convex/_generated/dataModel";
import { addTab } from "@editor/tabs";
import { useUser } from "@hub/auth";
import type { ComponentType } from "@lib/parser";
import { ElementIcon } from "@shared/ui-kit/library/ElementIcon";
import Button from "@shared/ui-kit/ui/Button";
import InitialsAvatar from "@shared/ui-kit/ui/InitialsAvatar";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface FileListItemProps {
  fileId: Id<"files">;
  fileName: string;
  fileType: string;
  projectId: string;
  updatedAt: number;
  lastEditor: Id<"users"> | null | undefined;
}

export function FileListItem({ fileId, fileName, fileType, projectId, updatedAt, lastEditor }: FileListItemProps) {
  const navigate = useNavigate();
  const { user } = useUser(lastEditor ?? null);

  const openFile = () => {
    addTab(fileId, fileName, projectId, "file");
    navigate(`/project/${projectId}/file/${fileId}`);
  };

  const formatLastEdit = () => {
    try {
      return formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const lastEditBy = user?.name ?? user?.email?.split("@")[0] ?? "Unknown";
  const avatarUrl = user?.image ?? undefined;

  return (
    <div
      onClick={openFile}
      className="group grid cursor-pointer grid-cols-[auto_2fr_minmax(120px,1fr)_minmax(140px,1fr)_auto] items-center gap-4 rounded-lg border border-neutral-100 bg-white px-4 py-3 text-neutral-750 transition-colors group-hover:text-primary-500 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-300 dark:group-hover:text-white hover:dark:bg-neutral-800"
    >
      <ElementIcon type={fileType as ComponentType} />
      <h3 className="truncate font-semibold text-base text-inherit group-hover:text-primary-500 dark:group-hover:text-white">
        {fileName}
      </h3>
      <div className="flex items-center gap-3 font-medium text-inherit text-sm group-hover:text-primary-500 dark:group-hover:text-white">
        {avatarUrl ? (
          <img src={avatarUrl} alt={lastEditBy} className="size-5 shrink-0 rounded-full object-cover" />
        ) : (
          <InitialsAvatar name={lastEditBy} size="md" className="shrink-0 border-0" />
        )}
        <span className="truncate">last edited by {lastEditBy}</span>
      </div>
      <div className="truncate font-medium text-inherit text-sm group-hover:text-primary-500 dark:group-hover:text-white">
        {formatLastEdit()}
      </div>
      <Button
        severity="secondary"
        onClick={(e) => {
          e.stopPropagation();
          openFile();
        }}
        size="small"
      >
        Edit
      </Button>
    </div>
  );
}
