import type { Id } from "@convex/_generated/dataModel";
import { useFileManagerStore } from "@project/file-manager";
import { executeAction } from "@shared/action";
import { addConditionalSegment } from "../services/addConditionalSegment";
import type { PropertyType } from "../types";
import { getOperatorConfig } from "../utils/getOperatorConfig";

interface UseClassInspectorActionsProps {
  projectId: Id<"projects">;
  fileId: Id<"files">;
  astPosition: number | null;
}

export function useClassInspectorActions({ projectId, fileId, astPosition }: UseClassInspectorActionsProps) {
  const properties = useFileManagerStore((state) => state.files[fileId]?.properties, projectId);

  const addClass = async (className: string) => {
    // Pass 0 as nodeStart when astPosition is null to indicate we need to create className attribute
    await executeAction("node.class.add", {
      className,
      nodeStart: astPosition ?? 0,
      projectId,
      fileId,
    });
    return true;
  };

  const handleAddCondition = async () => {
    if (!astPosition || !properties) return;

    const propertyKeys = Object.keys(properties);
    if (propertyKeys.length === 0) return;

    const firstProperty = propertyKeys[0];
    const propertyType = properties[firstProperty]?.type?.kind;

    // Get default operator and value from config
    const config = getOperatorConfig(propertyType as PropertyType, null, null);
    const operator = config.defaultOperator as string;
    const defaultValue = config.defaultTestValue;

    const result = await addConditionalSegment({
      projectId,
      fileId,
      selectedNodeAstPosition: astPosition,
      property: firstProperty,
      operator,
      testValue: defaultValue,
    });

    if (!result.success && result.error) {
      console.error("Failed to add conditional segment:", result.error);
    }
  };

  return {
    addClass,
    handleAddCondition,
  };
}
