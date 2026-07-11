import AssistentChat from "@assistent/components/AssistentChat";
import type { Id } from "@convex/_generated/dataModel";
import { useSelectedNode } from "@editor/canvas";
import { ErrorBoundary } from "@editor/error-boundary/components";
import { redo, undo, useHistory } from "@editor/history";
import { setEditorInspectorTab, useProjectManagerStore } from "@hub/projects";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  CodeIcon,
  DiamondIcon,
  ExportIcon,
  PaletteIcon,
  ShareNetworkIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { openModal } from "@shared/modal";
import Tabs from "@shared/ui-kit/editor/Tabs";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { Aside } from "@shared/ui-kit/layout/Aside";
import { AsideHeader } from "@shared/ui-kit/layout/AsideHeader";
import Button from "@shared/ui-kit/ui/Button";
import ButtonGroup from "@shared/ui-kit/ui/ButtonGroup";
import { UserAvatar } from "@shared/ui-kit/ui/UserAvatar";
import { Activity, useCallback, useEffect, useMemo } from "react";
import { useInstanceCheck } from "../hooks/useInstanceCheck";
import { DesignInspector } from "./DesignInspector";
import { InstancePanel } from "./InstancePanel";

export function InspectorAside({ projectId, fileId }: { projectId: Id<"projects">; fileId: Id<"files"> }) {
  const activeTab = useProjectManagerStore((state) => state.editorInspectorTab);
  const selectedNode = useSelectedNode(projectId, fileId);
  const isInstance = useInstanceCheck(projectId, fileId);
  const { canUndo, canRedo, history } = useHistory(fileId);

  const handleUndo = useCallback(async () => {
    if (!canUndo || !fileId || !history) return;
    try {
      await undo(fileId, projectId, history);
    } catch (error) {
      console.error("[InspectorAside] Failed to undo:", error);
    }
  }, [canUndo, fileId, projectId, history]);

  const handleRedo = useCallback(async () => {
    if (!canRedo || !fileId || !history) return;
    try {
      await redo(fileId, projectId, history);
    } catch (error) {
      console.error("[InspectorAside] Failed to redo:", error);
    }
  }, [canRedo, fileId, projectId, history]);

  const tabs = useMemo(() => {
    if (isInstance) {
      return [
        { id: "assistent", label: "Assistent", icon: SparkleIcon },
        { id: "instance", label: "Instance", icon: DiamondIcon },
      ];
    }
    return [
      { id: "assistent", label: "Assistent", icon: SparkleIcon },
      { id: "design", label: "Design", icon: PaletteIcon },
      { id: "dev", label: "Dev", icon: CodeIcon },
    ];
  }, [isInstance]);

  useEffect(() => {
    if (activeTab === "assistent") {
      return;
    }

    if (isInstance) {
      setEditorInspectorTab("instance");
    }

    if (!isInstance) {
      setEditorInspectorTab("design");
    }
  }, [isInstance, selectedNode]);

  return (
    <Aside position="right" layout="full" className="h-full">
      <ErrorBoundary>
        <AsideHeader tabsSlot={<Tabs activeTab={activeTab} setActiveTab={setEditorInspectorTab} tabs={tabs} />}>
          <div className="flex h-full items-center justify-between px-4">
            <UserAvatar />
            <ButtonGroup className="gap-3">
              <InlineIconButton
                icon={ArrowCounterClockwise}
                title="Undo"
                onClick={handleUndo}
                weight="regular"
                size="medium"
              />
              <InlineIconButton
                icon={ArrowClockwise}
                title="Redo"
                onClick={handleRedo}
                weight="regular"
                size="medium"
              />
              <InlineIconButton
                icon={ExportIcon}
                title="Export"
                onClick={() => openModal("application.notImplemented")}
                weight="regular"
                size="medium"
              />
              <Button
                icon={ShareNetworkIcon}
                size="tiny"
                title="Share"
                onClick={() => openModal("application.notImplemented")}
              >
                Share
              </Button>
            </ButtonGroup>
          </div>
        </AsideHeader>
        <Activity mode={activeTab === "assistent" ? "visible" : "hidden"}>
          <AssistentChat projectId={projectId} currentFileId={fileId} />
        </Activity>
        {isInstance ? (
          <Activity mode={activeTab === "instance" ? "visible" : "hidden"}>
            <InstancePanel
              projectId={projectId}
              fileId={fileId}
              nodeId={selectedNode ?? ""}
              key={`instance-panel-${selectedNode}`}
            />
          </Activity>
        ) : (
          <DesignInspector projectId={projectId} fileId={fileId} />
        )}
      </ErrorBoundary>
    </Aside>
  );
}
