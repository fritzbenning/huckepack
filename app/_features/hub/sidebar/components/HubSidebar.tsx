import { PinBoard, usePinnedItems } from "@hub/pinned-items";
import { Workspaces } from "@hub/workspace";
import { FolderUserIcon, HouseIcon, MagicWandIcon } from "@phosphor-icons/react";
import { openModal } from "@shared/modal";
import { Aside } from "@shared/ui-kit/layout/Aside";
import { AsideHeader } from "@shared/ui-kit/layout/AsideHeader";
import { AsideHeaderContent } from "@shared/ui-kit/layout/AsideHeaderContent";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import { AsideUser } from "@shared/ui-kit/layout/AsideUser";
import AsideItem from "@shared/ui-kit/ui/AsideItem";
import { useLocation } from "react-router-dom";

export function HubSidebar({ projectId }: { projectId: string }) {
  const location = useLocation();
  const { pinnedItems, loading } = usePinnedItems();

  return (
    <Aside position="left" layout="full" fixedWidth={true}>
      <div className="row-span-2 grid h-full min-h-0 grid-rows-[1fr_auto]">
        <div className="min-h-0 overflow-y-auto">
          <AsideHeader>
            <AsideHeaderContent projectId={projectId} />
          </AsideHeader>
          <AsideSection>
            <AsideUser />
          </AsideSection>
          <AsideSection title="Your Work" contentGap="tiny" indentedContent={false} titleGap={false}>
            <AsideItem icon={HouseIcon} href="/dashboard" isActive={location.pathname === "/dashboard"}>
              Dashboard
            </AsideItem>
            <AsideItem icon={MagicWandIcon} href="/imagine" isActive={location.pathname === "/imagine"}>
              Imagine
            </AsideItem>
            {/* <AsideItem icon={Clock} href="/recently-viewed" isActive={location.pathname === "/recently-viewed"}>
                Recents
              </AsideItem> */}
            <AsideItem icon={FolderUserIcon} href="/your-projects" isActive={location.pathname === "/your-projects"}>
              Your projects
            </AsideItem>
          </AsideSection>
          <AsideSection
            title="Workspaces"
            onAction={() => openModal("workspace.new")}
            indentedContent={false}
            titleGap={false}
          >
            <Workspaces />
          </AsideSection>
        </div>
        {!loading && pinnedItems && pinnedItems.length > 0 && (
          <AsideSection title="Pinned" indentedContent={false} titleGap={false}>
            <PinBoard />
          </AsideSection>
        )}
      </div>
    </Aside>
  );
}
