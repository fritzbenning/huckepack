import type { Id } from "@convex/_generated/dataModel";
import { ErrorBoundary } from "@editor/error-boundary/components";
import { FileTree } from "@editor/file-tree";
import { LayerTree } from "@editor/layer-tree";
import PropertyPanel from "@editor/property-panel/components/PropertyPanel";
import { prepareProjectRoute, setEditorExplorerTab, useProjectManagerStore } from "@hub/projects";
import { DatabaseIcon, FilesIcon, StackIcon } from "@phosphor-icons/react";
import Tabs from "@shared/ui-kit/editor/Tabs";
import { Aside } from "@shared/ui-kit/layout/Aside";
import { AsideHeader } from "@shared/ui-kit/layout/AsideHeader";
import { AsideHeaderContent } from "@shared/ui-kit/layout/AsideHeaderContent";
import { Activity } from "react";

export function ExplorerAside({ projectId, fileId }: { projectId: Id<"projects">; fileId: Id<"files"> }) {
  const activeTab = useProjectManagerStore((state) => state.editorExplorerTab);

  return (
    <Aside position="left" layout="full" className="h-full">
      <ErrorBoundary>
        <AsideHeader
          tabsSlot={
            <Tabs
              activeTab={activeTab}
              setActiveTab={setEditorExplorerTab}
              tabs={[
                { id: "files", label: "Files", icon: FilesIcon },
                { id: "layers", label: "Layers", icon: StackIcon },
                { id: "properties", label: "Properties", icon: DatabaseIcon },
              ]}
            />
          }
        >
          <AsideHeaderContent projectId={projectId} goBackTarget={prepareProjectRoute(projectId)} />
        </AsideHeader>
        <Activity mode={activeTab === "files" ? "visible" : "hidden"}>
          <FileTree projectId={projectId} fileId={fileId} />
        </Activity>
        <Activity mode={activeTab === "layers" ? "visible" : "hidden"}>
          <LayerTree projectId={projectId} fileId={fileId} />
        </Activity>
        <Activity mode={activeTab === "properties" ? "visible" : "hidden"}>
          <PropertyPanel projectId={projectId} fileId={fileId} />
        </Activity>
      </ErrorBoundary>
    </Aside>
  );
}
