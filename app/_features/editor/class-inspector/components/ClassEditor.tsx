import { Check, X } from "@phosphor-icons/react";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { InputField } from "@shared/ui-kit/inputs/input/InputField";

interface ClassEditorProps {
  editValue: string;
  token: string;
  onEditValue: (value: string) => void;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export function ClassEditor({ editValue, onEditValue, onSave, onCancel }: ClassEditorProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      onSave(editValue);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onCancel();
    }
  };

  const handleSaveMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleSaveClick = () => {
    onSave(editValue);
  };

  const handleCancelMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleCancelClick = () => {
    onCancel();
  };

  return (
    <div className="group flex flex-1 justify-between border-neutral-100 last:border-0 dark:border-neutral-750">
      <div className="flex flex-1 items-center gap-0.5">
        <InputField
          value={editValue}
          onChange={(e) => onEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={onCancel}
          onFocus={(e) => e.target.select()}
          dimension="small"
          tone="transparent"
          className="flex-1 text-2xs"
          autoFocus
        />
      </div>
      <div className="flex items-center gap-2">
        <InlineIconButton
          icon={Check}
          onMouseDown={handleSaveMouseDown}
          onClick={handleSaveClick}
          title="Save"
          weight="regular"
        />
        <InlineIconButton
          icon={X}
          onMouseDown={handleCancelMouseDown}
          onClick={handleCancelClick}
          title="Cancel"
          weight="regular"
        />
      </div>
    </div>
  );
}
