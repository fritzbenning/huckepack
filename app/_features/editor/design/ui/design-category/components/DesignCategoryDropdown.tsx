import type { Id } from "@convex/_generated/dataModel";
import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { DropdownOption } from "@editor/design/shared/utils/category/getCategoryDropdownOptions";
import { SelectList } from "@shared/ui-kit/ui/SelectList";
import { SelectPosition } from "@shared/ui-kit/ui/SelectPosition";
import type { RefObject } from "react";
import { addDesignRule } from "../services/addDesignRule";

interface DesignCategoryDropdownProps {
  isOpen: boolean;
  options: DropdownOption[];
  actionButtonRef: RefObject<HTMLButtonElement | null>;
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  astPosition: number | null;
  projectId: Id<"projects">;
  fileId: Id<"files">;
  onClose: () => void;
}

export function DesignCategoryDropdown({
  isOpen,
  options,
  actionButtonRef,
  classes,
  astPosition,
  projectId,
  fileId,
  onClose,
}: DesignCategoryDropdownProps) {
  const handleSelect = async (value: string) => {
    const option = options.find((opt) => opt.value === value);
    if (!option) return;

    await addDesignRule({
      value: option.dropdownValue,
      config: option.config,
      classes,
      astPosition,
      projectId,
      fileId,
    });
    onClose();
  };

  if (!isOpen || options.length === 0 || !actionButtonRef.current) {
    return null;
  }

  return (
    <SelectPosition triggerRef={actionButtonRef} x="right" y="bottom" distance="small" width={120}>
      <SelectList
        options={options.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        onSelect={handleSelect}
        size="small"
      />
    </SelectPosition>
  );
}
