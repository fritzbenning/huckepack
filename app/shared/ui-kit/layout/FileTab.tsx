import { removeTab, useTabStore } from "@editor/tabs";
import { DiamondIcon } from "@phosphor-icons/react";
import { prepareProjectFileRoute } from "@project/file";
import { IconAction } from "@shared/ui-kit/ui/IconAction";
import type React from "react";
import { useNavigate } from "react-router-dom";
import Tab from "./Tab";

interface FileTabProps {
  fileId: string;
  fileName: string;
  isActive?: boolean;
}

export default function FileTab({ fileId, isActive = false }: FileTabProps) {
  const navigate = useNavigate();
  const tab = useTabStore((state) => state.openTabs.find((tab) => tab.id === fileId));

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeTab(fileId);
  };

  const handleOpenFile = () => {
    if (tab?.projectId) {
      const route = prepareProjectFileRoute(tab.projectId, fileId);
      navigate(route);
    }
  };

  return (
    <Tab onClick={handleOpenFile} variant="file" isActive={isActive}>
      <div className="flex items-center gap-0.5 text-neutral-500 transition-colors group-hover:text-primary-500 dark:text-neutral-400 dark:group-hover:text-white">
        <DiamondIcon className="size-3" weight="duotone" />
        <span className="truncate px-1 font-semibold text-xs">{tab?.title}</span>
      </div>
      <IconAction
        onClick={handleClose}
        size="sm"
        className="opacity-0 transition-opacity group-hover:opacity-100"
        asDiv={true}
      />
    </Tab>
  );
}
