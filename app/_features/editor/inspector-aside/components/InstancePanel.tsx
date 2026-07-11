import type { Id } from "@convex/_generated/dataModel";
import { addTab } from "@editor/tabs";
import { cn } from "@lib/utils";
import { Sliders } from "@phosphor-icons/react";
import { prepareProjectFileRoute } from "@project/file/services/prepareProjectFileRoute";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import IdlePlaceholder from "@shared/ui-kit/ui/IdlePlaceholder";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useInstance } from "../hooks/useInstance";
import { InstancePanelHeader } from "./InstancePanelHeader";
import { InstancePropertyInput } from "./InstancePropertyInput";

interface InstancePanelProps {
  projectId: string;
  fileId: Id<"files">;
  nodeId: string;
}

export function InstancePanel({ projectId, fileId, nodeId }: InstancePanelProps) {
  const navigate = useNavigate();

  const { nodeData, getPropValue, handlePropChange } = useInstance({
    projectId,
    fileId,
    nodeId,
  });

  const routeToMasterInstance = useCallback(() => {
    if (!nodeData?.componentFileId || !nodeData.componentFileName) return;

    const route = prepareProjectFileRoute(projectId, nodeData.componentFileId);
    addTab(nodeData.componentFileId, nodeData.componentFileName, projectId, "file");
    navigate(route);
  }, [nodeData?.componentFileId, nodeData?.componentFileName, projectId, navigate]);

  const stableHandlePropChange = useCallback(
    (propName: string, value: string | number | boolean) => {
      handlePropChange(propName, value);
    },
    [handlePropChange]
  );

  if (!nodeData) {
    throw new Error("Component file not found");
  }

  const propsEntries = Object.entries(nodeData.props);

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_1fr]">
      <InstancePanelHeader onEditMaster={routeToMasterInstance} />

      <div
        className={cn(
          "flex min-h-0 flex-col overflow-y-auto",
          propsEntries.length === 0 && "items-center justify-center"
        )}
      >
        {propsEntries.length === 0 ? (
          <AsideSection>
            <IdlePlaceholder icon={Sliders} label="No properties available for this component" />
          </AsideSection>
        ) : (
          <AsideSection title="Properties" divider={false}>
            {propsEntries.map(([propName, prop]) => (
              <InstancePropertyInput
                key={propName}
                propName={propName}
                prop={prop}
                currentValue={getPropValue(propName)}
                projectId={projectId}
                fileId={fileId}
                onPropChange={stableHandlePropChange}
              />
            ))}
          </AsideSection>
        )}
      </div>
    </div>
  );
}
