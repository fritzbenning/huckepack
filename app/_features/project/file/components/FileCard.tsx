import { addTab } from "@editor/tabs";
import { usePinnedItems } from "@hub/pinned-items";
import {
  CodeIcon,
  FileIcon,
  FileTextIcon,
  GearIcon,
  ImageIcon,
  PaletteIcon,
  PushPinIcon,
  PushPinSlashIcon,
} from "@phosphor-icons/react";
import { executeAction } from "@shared/action";
import { openModal } from "@shared/modal";
import CardTeaser from "@shared/ui-kit/cards/CardTeaser";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { prepareProjectFileRoute } from "../services/prepareProjectFileRoute";

export interface FileCardProps {
  fileName: string;
  fileId: string;
  filePath: string;
  fileType: string;
  projectId: string;
  isDraft?: boolean;
  tags?: string[];
  buttonLabel?: string;
  className?: string;
  demo?: boolean;
}

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case "tsx":
    case "ts":
    case "jsx":
    case "js":
      return CodeIcon;
    case "png":
    case "jpg":
    case "jpeg":
    case "svg":
    case "gif":
      return ImageIcon;
    case "css":
    case "scss":
    case "less":
      return PaletteIcon;
    default:
      return FileIcon;
  }
};

const FileCard: React.FC<FileCardProps> = ({
  fileName,
  fileId,
  filePath,
  fileType,
  projectId,
  buttonLabel = "Open file",
  demo = false,
  className = "",
}) => {
  const navigate = useNavigate();
  const { pinnedItems } = usePinnedItems();
  const FileIcon = getFileIcon(fileType);

  const isPinned = useMemo(
    () => pinnedItems.some((item) => item.pinnedItem.entityType === "file" && item.pinnedItem.entityId === fileId),
    [pinnedItems, fileId]
  );

  const handlePinClick = () => {
    executeAction(isPinned ? "hub.unpin" : "hub.pin", {
      entity_type: "file",
      entity_id: fileId,
      entity: {
        name: fileName,
      },
    });
  };

  const handleSettingsClick = () => {
    openModal("file.settings", {
      fileId,
      projectId,
    });
  };

  const handleOpenFile = () => {
    const route = prepareProjectFileRoute(projectId, fileId);
    addTab(fileId, fileName, projectId, "file");
    navigate(route);
  };

  return (
    <CardTeaser
      head={<FileIcon className="size-8 text-neutral-600 dark:text-neutral-400" weight="duotone" />}
      headline={fileName}
      subline={filePath}
      sublineIcon={FileTextIcon}
      buttonLabel={buttonLabel}
      onClick={handleOpenFile}
      className={className}
      actions={
        demo ? null : (
          <>
            <button
              type="button"
              className="size-4 py-1 text-neutral-400 opacity-0 transition-all hover:text-primary-500 group-hover:opacity-100 dark:text-neutral-400 dark:hover:text-neutral-100"
              onClick={handleSettingsClick}
              title="File settings"
            >
              <GearIcon className="size-4" weight="duotone" />
            </button>
            <button
              type="button"
              className="size-4 py-1 text-neutral-400 opacity-0 transition-all hover:text-primary-500 group-hover:opacity-100 dark:text-neutral-400 dark:hover:text-neutral-100"
              onClick={handlePinClick}
              title={isPinned ? "Unpin file" : "Pin file"}
            >
              {isPinned ? (
                <PushPinSlashIcon className="size-4" weight="duotone" />
              ) : (
                <PushPinIcon className="size-4" weight="duotone" />
              )}
            </button>
          </>
        )
      }
    />
  );
};

export default FileCard;
