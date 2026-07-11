import type { Id } from "@convex/_generated/dataModel";
import { addTab } from "@editor/tabs";
import {
  DiamondIcon,
  PlusCircleIcon,
  PlusIcon,
  QuestionIcon,
  TrashSimpleIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import { prepareProjectFileRoute } from "@project/file/services/prepareProjectFileRoute";
import { useStoreFiles } from "@project/file-manager/stores/fileManagerStore";
import { executeAction } from "@shared/action";
import { openModal } from "@shared/modal";
import { openPinnedModal } from "@shared/pinned-modal";
import { AsideFooter } from "@shared/ui-kit/layout/AsideFooter";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import { ActionButton } from "@shared/ui-kit/ui/ActionButton";
import AsideItem from "@shared/ui-kit/ui/AsideItem";
import type React from "react";
import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FileTreeProps {
  projectId: Id<"projects">;
  fileId: Id<"files">;
}

export function FileTree({ projectId, fileId }: FileTreeProps) {
  const navigate = useNavigate();
  const storeFiles = useStoreFiles(projectId);
  const helpIconRef = useRef<HTMLButtonElement>(null);

  const files = useMemo(() => {
    return storeFiles.map((file) => ({
      id: file.id,
      name: file.name,
      type: file.extension === "tsx" || file.extension === "jsx" ? "component" : "file",
    }));
  }, [storeFiles]);

  const openFile = (fileId: string, fileName: string) => {
    const route = prepareProjectFileRoute(projectId, fileId);
    addTab(fileId, fileName, projectId, "file");
    navigate(route);
  };

  const handleAddFile = () => {
    openModal("file.new", { projectId });
  };

  const handleAddCanvas = () => {
    openModal("file.import", { projectId });
  };

  const handleHelpClick = () => {
    if (helpIconRef.current) {
      openPinnedModal("file-tree.help", helpIconRef, "left");
    } else {
      console.warn("helpIconRef.current is null");
    }
  };

  const handleDeleteFile = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation(); // Prevent triggering the file open action
    openModal("file.delete", { fileId, projectId });
  };

  const handleInsertComponent = async (e: React.MouseEvent, componentFileId: string) => {
    e.stopPropagation();

    try {
      await executeAction("instance.insert", {
        instanceFileId: componentFileId,
        projectId,
        targetFileId: fileId,
      });
    } catch (error) {
      console.error("Error inserting component:", error);
      toast.error("Failed to insert component", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const groupedFiles = useMemo(() => {
    if (!files || files.length === 0) return new Map<string, typeof files>();

    const groups = new Map<string, typeof files>();
    for (const file of files) {
      const type = file.type || "other";
      if (!groups.has(type)) {
        groups.set(type, []);
      }
      groups.get(type)!.push(file);
    }

    return groups;
  }, [files]);

  if (!files || files.length === 0) {
    return (
      <div className="grid h-full min-h-0 grid-rows-[1fr_auto]">
        <div className="flex items-center justify-center px-2 py-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
          No files found
        </div>
        <AsideFooter icon={QuestionIcon} onIconClick={handleHelpClick} iconRef={helpIconRef}>
          <div className="flex items-center gap-2">
            <ActionButton icon={PlusIcon} onClick={handleAddFile}>
              File
            </ActionButton>
            <ActionButton icon={UploadSimpleIcon} onClick={handleAddCanvas}>
              Import
            </ActionButton>
          </div>
        </AsideFooter>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[1fr_auto]">
      <div className="min-h-0 overflow-y-auto">
        {Array.from(groupedFiles.entries()).map(([type, typeFiles]) => (
          <AsideSection
            key={type}
            // title={`${type}s`}
            contentGap="tiny"
            divider={false}
            indentedContent={false}
            titleGap={false}
            className="pt-2"
          >
            {typeFiles.map((file) => {
              const isActive = file.id === fileId;
              const isComponent = file.type === "component";

              return (
                <AsideItem
                  key={file.id}
                  icon={DiamondIcon}
                  isActive={isActive}
                  onClick={() => openFile(file.id, file.name)}
                  className="flex items-center justify-between"
                  primaryAction={{
                    icon: TrashSimpleIcon,
                    onClick: (e) => handleDeleteFile(e, file.id),
                    title: "Delete file",
                  }}
                  secondaryAction={
                    !isActive && isComponent
                      ? {
                          icon: PlusCircleIcon,
                          onClick: (e) => handleInsertComponent(e, file.id),
                          title: "Insert component",
                        }
                      : undefined
                  }
                >
                  {file.name}
                </AsideItem>
              );
            })}
          </AsideSection>
        ))}
      </div>
      <AsideFooter icon={QuestionIcon} onIconClick={handleHelpClick} iconRef={helpIconRef}>
        <div className="flex items-center gap-2">
          <ActionButton icon={PlusIcon} onClick={handleAddFile}>
            File
          </ActionButton>
          <ActionButton icon={UploadSimpleIcon} onClick={handleAddCanvas}>
            Import
          </ActionButton>
        </div>
      </AsideFooter>
    </div>
  );
}
