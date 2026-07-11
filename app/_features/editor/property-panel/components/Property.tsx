import { Asterisk, MinusIcon } from "@phosphor-icons/react";
import type { FormattedParam, PropertyType } from "@project/ast-parser";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { Select } from "@shared/ui-kit/inputs/select/Select";
import { TypedInput } from "@shared/ui-kit/inputs/typed-input";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import { Tooltip } from "@shared/ui-kit/ui/Tooltip";
import { toTitleCase } from "@shared/utils/format";
import { CHILDREN_TYPES, PROPERTY_TYPES } from "../utils/convertPropertyType";
import { normalizePropertyName } from "../utils/normalizePropertyName";

interface PropertyProps {
  name: string;
  type: PropertyType;
  param: FormattedParam | undefined;
  normalizedTypeKind: string;
  optional: boolean;
  projectId: string;
  fileId: string;
  onValueChange: (name: string, value: string | number | boolean, type: string) => void;
  onTypeChange: (name: string, newType: string, currentType: string) => void;
  onOptionalityChange: (name: string, optional: boolean) => void;
  onRemove: (name: string) => void;
  onRename?: (oldName: string, newName: string) => void;
}

export function Property({
  name,
  type,
  param,
  normalizedTypeKind,
  optional,
  projectId,
  fileId,
  onValueChange,
  onTypeChange,
  onOptionalityChange,
  onRemove,
  onRename,
}: PropertyProps) {
  const handleTitleRename = (newName: string) => {
    if (onRename) {
      const newPropertyName = normalizePropertyName(newName);
      if (newPropertyName && newPropertyName !== name) {
        onRename(name, newPropertyName);
      }
    }
  };

  const isChildren = name.toLowerCase() === "children";
  const displayName = toTitleCase(name) || name;
  const canEditTitle = !!onRename && !isChildren;

  const availableTypes = isChildren ? CHILDREN_TYPES : PROPERTY_TYPES;

  return (
    <AsideSection
      key={name}
      className="flex flex-col gap-2"
      title={displayName}
      onAction={() => onRemove(name)}
      actionIcon={MinusIcon}
      editableTitle={canEditTitle}
      onTitleRename={canEditTitle ? handleTitleRename : undefined}
      titleNormalCase={isChildren}
    >
      <div className="flex items-center gap-2">
        <Select
          options={availableTypes.map((pt) => ({ value: pt.value, label: pt.label }))}
          value={normalizedTypeKind}
          onChange={(value) => {
            if (value && value !== type.kind) {
              onTypeChange(name, value, type.kind);
            }
          }}
          className="w-20 shrink-0"
          dimension="small"
          tone="emphasized"
          x="right"
          y="bottom"
        />
        <TypedInput
          type={type}
          value={param?.defaultValue ?? null}
          onChange={(value) => onValueChange(name, value, type.kind)}
          id={name}
          projectId={projectId}
          fileId={fileId}
        />
        <Tooltip content={optional ? "Make mandatory" : "Make optional"}>
          <IconToggle
            icon={Asterisk}
            isActive={!optional}
            onChange={() => onOptionalityChange(name, !optional)}
            size="small"
          />
        </Tooltip>
      </div>
    </AsideSection>
  );
}
