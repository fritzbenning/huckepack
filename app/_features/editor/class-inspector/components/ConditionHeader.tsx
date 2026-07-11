import { useTemplateLiteralTest } from "@editor/class-manager";
import type { ConditionalExpressionSegment, ExpressionSegment } from "@editor/class-manager/types";
import { TrashSimpleIcon } from "@phosphor-icons/react";
import { useFileManagerStore } from "@project/file-manager";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { Select } from "@shared/ui-kit/inputs/select/Select";
import { useState } from "react";
import { useOperators } from "../hooks/useOperators";
import { removeConditionalSegment } from "../services/removeConditionalSegment";
import type { Operator, PropertyType } from "../types";
import { getOperatorConfig } from "../utils/getOperatorConfig";
import { TestValueInput } from "./TestValueInput";

interface ConditionHeaderProps {
  segment: ExpressionSegment;
  projectId: string;
  fileId: string;
}

export function ConditionHeader({ segment, projectId, fileId }: ConditionHeaderProps) {
  const properties = useFileManagerStore((state) => state.files[fileId]?.properties, projectId);
  const [isEditingValue, setIsEditingValue] = useState(false);

  const { property, propertyType, operator, testValue, updateProperty, updateOperator, updateTestValue } =
    useTemplateLiteralTest(segment as ConditionalExpressionSegment, projectId, fileId);

  const validOperators = useOperators(propertyType);
  const operatorConfig = getOperatorConfig(propertyType as PropertyType, operator as Operator, testValue);
  const { showOperatorDropdown, showValueInput } = operatorConfig;

  // Get union options for the selected property
  const unionOptions =
    property && properties?.[property]?.type?.kind === "union"
      ? properties[property].type.unionOptions || []
      : undefined;

  const handleDelete = () => {
    removeConditionalSegment({
      projectId,
      fileId,
      expressionSpanStart: segment.span.start,
    });
  };

  return (
    <div className="flex w-full flex-1 items-stretch gap-1.5 px-2 pt-2">
      <div className="min-w-0 flex-1 rounded-sm bg-white px-2 font-bold text-2xs dark:bg-neutral-850">
        <div className="flex h-7 w-full items-stretch gap-2">
          {!isEditingValue && (
            <>
              <Select
                options={Object.keys(properties || {}).map((key) => ({ value: key, label: key }))}
                value={property || ""}
                onChange={updateProperty}
                dimension="small"
                tone="transparent"
                className="min-w-0 flex-1"
                x="left"
                dropdownWidth={160}
                xOffset={-8}
                distance="medium"
              />
              {showOperatorDropdown && <div className="w-px shrink-0 bg-neutral-150 dark:bg-neutral-800" />}
              {showOperatorDropdown && (
                <Select
                  options={validOperators}
                  value={operator || ""}
                  onChange={updateOperator}
                  dimension="small"
                  tone="transparent"
                  className="min-w-0 flex-1"
                  dropdownWidth={100}
                  x="left"
                  xOffset={-8}
                  distance="medium"
                />
              )}
              {showValueInput && <div className="w-px shrink-0 bg-neutral-150 dark:bg-neutral-800" />}
            </>
          )}
          {showValueInput && (
            <div className="flex min-w-0 flex-1 items-center">
              <TestValueInput
                type={propertyType}
                testValue={testValue}
                onSave={updateTestValue}
                onEdit={setIsEditingValue}
                unionOptions={unionOptions}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center rounded-sm bg-white font-bold text-2xs dark:bg-neutral-850">
        <InlineIconButton
          icon={TrashSimpleIcon}
          onClick={handleDelete}
          title="Delete condition"
          className="h-full px-2"
        />
      </div>
    </div>
  );
}
