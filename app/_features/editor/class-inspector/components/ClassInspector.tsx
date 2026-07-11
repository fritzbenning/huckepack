import type { Id } from "@convex/_generated/dataModel";
import { useSelectedNode } from "@editor/canvas";
import { useClassInspectorActions } from "@editor/class-inspector/hooks/useClassInspectorActions";
import { useNodeClasses } from "@editor/class-inspector/hooks/useNodeClasses";
import { CursorClickIcon, PlusIcon } from "@phosphor-icons/react";
import { Combobox } from "@shared/ui-kit/inputs/combobox/Combobox";
import { AsideFooter } from "@shared/ui-kit/layout/AsideFooter";
import { ActionButton } from "@shared/ui-kit/ui/ActionButton";
import IdlePlaceholder from "@shared/ui-kit/ui/IdlePlaceholder";
import { Activity, useState } from "react";
import { tailwindClassOptions } from "../tailwindClasses";
import { ClassViewer } from "./ClassViewer";

interface ClassInspectorProps {
  projectId: Id<"projects">;
  fileId: Id<"files">;
}

export function ClassInspector({ projectId, fileId }: ClassInspectorProps) {
  const selectedNode = useSelectedNode(projectId, fileId);

  const { astPosition, classes } = useNodeClasses(projectId, fileId);
  const [selectedClass, setSelectedClass] = useState("");
  const { addClass, handleAddCondition } = useClassInspectorActions({ projectId, fileId, astPosition });

  const handleAddClass = async (className: string) => {
    const success = await addClass(className);
    if (success) {
      setSelectedClass("");
    }
  };

  if (selectedNode) {
    return (
      <div className="grid h-full min-h-0 grid-rows-[1fr_auto]">
        <div className="min-h-0 overflow-y-auto">
          <Activity mode={classes ? "visible" : "hidden"}>
            <ClassViewer
              projectId={projectId}
              fileId={fileId}
              selectedNodeAstPosition={astPosition}
              classes={classes}
              nodeId={selectedNode}
            />
          </Activity>
        </div>
        <AsideFooter>
          <div className="flex flex-1 items-center justify-between gap-2">
            <Combobox
              options={tailwindClassOptions}
              value={selectedClass}
              onValueChange={handleAddClass}
              placeholder="Type a Tailwind class"
              emptyText="No classes found."
              allowCustom={true}
              maxDisplayItems={1500}
              hideSearchIcon={true}
              tone="transparent"
              y="top"
              distance="large"
              className="flex-1"
            />
            <ActionButton icon={PlusIcon} onClick={handleAddCondition}>
              Condition
            </ActionButton>
          </div>
        </AsideFooter>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[1fr_auto]">
      <div className="min-h-0 overflow-y-auto">
        <IdlePlaceholder icon={CursorClickIcon} label="Please select a node" />
      </div>
    </div>
  );
}
