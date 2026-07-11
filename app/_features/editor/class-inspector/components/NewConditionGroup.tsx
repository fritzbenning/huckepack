import type { Id } from "@convex/_generated/dataModel";
import type { Properties } from "@project/ast-parser";
import { useFileManagerStore } from "@project/file-manager";
import { InlineAction } from "@shared/ui-kit/ui/InlineAction";
import { addConditionalSegment } from "../services/addConditionalSegment";
import type { PropertyType } from "../types";
import { getOperatorConfig } from "../utils/getOperatorConfig";

interface NewConditionGroupProps {
  projectId: string;
  fileId: string;
  selectedNodeAstPosition: number | null;
}

export function NewConditionGroup({ projectId, fileId, selectedNodeAstPosition }: NewConditionGroupProps) {
  const properties = useFileManagerStore(
    (state) => state.files[fileId as Id<"files">]?.properties,
    projectId as Id<"projects">
  ) as Properties | undefined;

  const handleAddCondition = async () => {
    if (!selectedNodeAstPosition || !properties) return;

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
      selectedNodeAstPosition,
      property: firstProperty,
      operator,
      testValue: defaultValue,
    });

    if (!result.success && result.error) {
      console.error("Failed to add conditional segment:", result.error);
    }
  };

  return (
    <InlineAction
      onClick={handleAddCondition}
      label="Add condition"
      wrapperClassName="w-full rounded-lg bg-neutral-100 px-3 py-2 dark:bg-neutral-900"
    />
  );
}
