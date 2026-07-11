import { usePlatform } from "@application/hooks/usePlatform";
import { useTabStore } from "@editor/tabs";
import { GridFourIcon } from "@phosphor-icons/react";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import FileTab from "./FileTab";
import IconTab from "./IconTab";

export default function TitleBar() {
  const { isMac } = usePlatform();
  const location = useLocation();

  const openTabs = useTabStore((state) => state.openTabs);

  return (
    <div className="relative col-span-2 flex h-9.5 w-full shrink-0 select-none overflow-hidden">
      <div
        className={`app-drag-region relative z-10 flex min-w-0 flex-1 items-center ${isMac ? "pr-16 pl-16" : "pr-32 pl-4"}`}
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <div className="flex h-full shrink-0 items-center gap-4 px-4">
          <IconTab to="/dashboard" icon={GridFourIcon} isActive={location.pathname === "/dashboard"} />
        </div>
        <div className="hide-scrollbar flex h-full min-w-0 flex-1 items-center justify-center gap-1.5 overflow-x-auto px-4">
          {openTabs.map((tab, index) => (
            <Fragment key={tab.id}>
              <FileTab
                fileId={tab.id}
                fileName={tab.title}
                isActive={location.pathname === `/project/${tab.projectId}/file/${tab.id}`}
              />
              {index < openTabs.length - 1 && <div className="h-4 w-0.25 shrink-0 bg-black/10 dark:bg-white/15" />}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
