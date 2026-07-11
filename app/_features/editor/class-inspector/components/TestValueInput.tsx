import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { InputField } from "@shared/ui-kit/inputs/input/InputField";
import { Select } from "@shared/ui-kit/inputs/select/Select";
import { Check, X } from "@phosphor-icons/react";
import { addQuotes, stripQuotes } from "@shared/utils/format";
import { Activity, useEffect, useRef, useState } from "react";
import { BOOLEAN_OPTIONS } from "../constants";

interface TestValueInputProps {
  type: string | null;
  testValue: string | number | boolean | null;
  onSave: (value: string) => void;
  onEdit?: (isEditing: boolean) => void;
  unionOptions?: (string | number)[];
}

export function TestValueInput({ type, testValue, onSave, onEdit, unionOptions }: TestValueInputProps) {
  const initialValue = testValue != null ? String(testValue) : "";

  const [editValue, setEditValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newValue = testValue != null ? String(testValue) : "";
    setEditValue(newValue);
  }, [testValue]);

  const displayValue = type === "string" && !isFocused ? addQuotes(editValue) : editValue;

  const handleSave = () => {
    const valueToSave = type === "string" ? stripQuotes(editValue) : editValue;
    onSave(valueToSave);
    setIsEditing(false);
    onEdit?.(false);
    inputRef.current?.blur();
  };

  const handleCancel = () => {
    // Reset to original value
    const originalValue = testValue != null ? String(testValue) : "";
    setEditValue(originalValue);
    setIsEditing(false);
    onEdit?.(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      handleCancel();
    }
  };

  const handleSaveMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleCancelMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  if (type === "boolean") {
    return (
      <Select
        options={BOOLEAN_OPTIONS}
        value={initialValue}
        onChange={onSave}
        dimension="small"
        tone="transparent"
        className="w-full"
        x="right"
        xOffset={8}
        distance="medium"
      />
    );
  }

  if (type === "union" && unionOptions && unionOptions.length > 0) {
    const unionSelectOptions = unionOptions.map((option) => ({
      value: String(option),
      label: String(option),
    }));
    return (
      <Select
        options={unionSelectOptions}
        value={initialValue}
        onChange={onSave}
        dimension="small"
        tone="transparent"
        className="w-full"
        x="right"
        xOffset={8}
        distance="medium"
        dropdownWidth={160}
      />
    );
  }

  if (type === "string" || type === "number") {
    return (
      <div className="flex w-full items-center gap-3">
        <InputField
          ref={inputRef}
          type={type === "number" ? "number" : "text"}
          value={displayValue}
          onChange={(e) => {
            const newValue = e.target.value;
            // If string type and focused, strip quotes from input
            const processedValue = type === "string" && isFocused ? stripQuotes(newValue) : newValue;
            setEditValue(processedValue);
            if (!isEditing) {
              setIsEditing(true);
              onEdit?.(true);
            }
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setIsFocused(false);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            // Strip quotes when focusing
            if (type === "string") {
              const valueWithoutQuotes = stripQuotes(editValue);
              setEditValue(valueWithoutQuotes);
              // Select all text after a short delay to ensure value is updated
              setTimeout(() => {
                e.target.select();
              }, 0);
            } else {
              e.target.select();
            }
            if (!isEditing) {
              setIsEditing(true);
              onEdit?.(true);
            }
          }}
          tone="transparent"
          dimension="small"
          className="min-w-0 flex-1 font-medium text-2xs"
        />
        <Activity mode={isEditing ? "visible" : "hidden"}>
          <div className="flex shrink-0 items-center gap-1.5">
            <InlineIconButton icon={Check} onMouseDown={handleSaveMouseDown} onClick={handleSave} title="Save" />
            <InlineIconButton icon={X} onMouseDown={handleCancelMouseDown} onClick={handleCancel} title="Cancel" />
          </div>
        </Activity>
      </div>
    );
  }
}
