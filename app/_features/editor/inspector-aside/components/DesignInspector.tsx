import type { Id } from "@convex/_generated/dataModel";
import { useSelectedNode } from "@editor/canvas";
import { ClassInspector } from "@editor/class-inspector";
import DesignPanel from "@editor/design/ui/design-panel/components/DesignPanel";
import { useModalTrigger } from "@editor/design/ui/design-panel/hooks/useModalTrigger";
import { useProjectManagerStore } from "@hub/projects";
import { CursorClickIcon, FrameCornersIcon } from "@phosphor-icons/react";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import Button from "@shared/ui-kit/ui/Button";
import IdlePlaceholder from "@shared/ui-kit/ui/IdlePlaceholder";
import { Activity } from "react";
import { usePresentNodes } from "../hooks/usePresentNodes";

export function DesignInspector({ projectId, fileId }: { projectId: Id<"projects">; fileId: Id<"files"> }) {
  const activeTab = useProjectManagerStore((state) => state.editorInspectorTab);
  const selectedNode = useSelectedNode(projectId, fileId);
  const nodeIds = usePresentNodes(projectId, fileId);
  const viewportModal = useModalTrigger();

  return (
    <>
      {nodeIds.map((nodeId) => (
        <Activity
          key={`design-panel-${nodeId}`}
          mode={activeTab === "design" && selectedNode === nodeId ? "visible" : "hidden"}
        >
          <DesignPanel projectId={projectId} fileId={fileId} nodeId={nodeId} />
        </Activity>
      ))}
      <Activity mode={activeTab === "design" && !selectedNode ? "visible" : "hidden"}>
        <div className="grid h-full min-h-0 grid-rows-[1fr_auto]">
          <div className="grid min-h-0 grid-rows-[auto_1fr] overflow-y-auto">
            <AsideSection>
              <Button
                icon={FrameCornersIcon}
                onClick={() => viewportModal.open("design-panel.viewport-settings", "right", { projectId, fileId })}
                ref={viewportModal.ref}
              >
                Viewport settings
              </Button>
            </AsideSection>
            <IdlePlaceholder icon={CursorClickIcon} label="Please select a node" />
          </div>
        </div>
      </Activity>
      <Activity mode={activeTab === "dev" ? "visible" : "hidden"}>
        <ClassInspector projectId={projectId} fileId={fileId} />
      </Activity>
    </>
  );
}
