import { setActiveTool, toggleCodeEditor, useCanvasStore } from "@editor/canvas";
import { setFocusMode } from "@editor/canvas/stores/canvasStore";
import { ChatCircleIcon, ClockIcon, CodeIcon, CursorIcon, PlayIcon, SwatchesIcon } from "@phosphor-icons/react";
import { closeEditorBodyModal, openEditorBodyModal, useEditorBodyModalStore } from "@shared/body-modal";
import { openModal } from "@shared/modal";
import { Tool } from "@shared/ui-kit/editor/ui/Tool";
import { ZoomInput } from "@shared/ui-kit/editor/ZoomInput";
import { AddElement } from "./AddElement";
import { Divider } from "./Divider";
import { ToolbarContainer } from "./ToolbarContainer";

export function FloatingToolbar({
  projectId,
  fileId,
  setZoomToValue,
}: {
  projectId: string;
  fileId: string;
  setZoomToValue: (zoom: number) => void;
}) {
  const activeTool = useCanvasStore((state) => state.canvases[projectId]?.activeTool ?? "edit-tool");
  const showCodeEditor = useCanvasStore((state) => state.canvases[projectId]?.showCodeEditor ?? false);
  const isTimelineOpen = useEditorBodyModalStore((state) => state.currentModal === "history.timeline" && state.isOpen);

  const enableTestMode = () => {
    setActiveTool(projectId, "test-tool");
    setFocusMode(projectId, true);
  };

  const handleToolChange = (tool: string) => {
    setActiveTool(projectId, tool);
    setFocusMode(projectId, false);
  };

  const handleCodeEditorToggle = () => {
    toggleCodeEditor(projectId);
    setActiveTool(projectId, "edit-tool");
    setFocusMode(projectId, false);
  };

  const handleTimelineToggle = () => {
    if (isTimelineOpen) {
      closeEditorBodyModal();
    } else {
      openEditorBodyModal("history.timeline", { projectId, fileId });
    }
  };

  return (
    <ToolbarContainer>
      <AddElement projectId={projectId} fileId={fileId} />
      <Tool icon={CursorIcon} isActive={activeTool === "edit-tool"} onClick={() => handleToolChange("edit-tool")} />
      <Tool icon={PlayIcon} isActive={activeTool === "test-tool"} onClick={enableTestMode} />
      <Tool
        icon={ChatCircleIcon}
        isActive={activeTool === "comment-tool"}
        onClick={() => openModal("application.notImplemented")}
      />
      <Divider />
      <Tool
        icon={SwatchesIcon}
        isActive={activeTool === "theme-tool"}
        onClick={() => openModal("application.notImplemented")}
      />
      <Tool icon={ClockIcon} isActive={isTimelineOpen} onClick={handleTimelineToggle} />
      <Tool icon={CodeIcon} isActive={showCodeEditor} onClick={handleCodeEditorToggle} />
      <ZoomInput setZoomToValue={setZoomToValue} projectId={projectId} />
    </ToolbarContainer>
  );
}
