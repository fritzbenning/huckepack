import type { Id } from "@convex/_generated/dataModel";
import type { ComponentProp } from "@editor/layer-tree";
import { AsteriskIcon } from "@phosphor-icons/react";
import { TypedInput } from "@shared/ui-kit/inputs/typed-input";
import { useCallback } from "react";

interface InstancePropertyInputProps {
  propName: string;
  prop: ComponentProp;
  currentValue: string | number | boolean | null;
  isUpdating?: boolean;
  projectId: string;
  fileId: Id<"files">;
  onPropChange: (propName: string, value: string | number | boolean) => void;
}

export function InstancePropertyInput({
  propName,
  prop,
  currentValue,
  isUpdating = false,
  projectId,
  fileId,
  onPropChange,
}: InstancePropertyInputProps) {
  const handleChange = useCallback(
    (value: string | number | boolean) => {
      onPropChange(propName, value);
    },
    [propName, onPropChange]
  );

  return (
    <div className="flex gap-2">
      <label
        htmlFor={propName}
        className="flex w-22 items-center gap-1 truncate font-medium text-xs text-neutral-750 dark:text-neutral-300"
      >
        {propName}
      </label>
      <div className="flex flex-1 items-center gap-2">
        {!prop.optional ? (
          <AsteriskIcon className="size-3 shrink-0 text-neutral-500" />
        ) : (
          <div className="size-3 shrink-0" />
        )}
        <TypedInput
          type={prop.type}
          value={currentValue}
          onChange={handleChange}
          id={propName}
          placeholder={`Enter ${propName}`}
          disabled={isUpdating}
          projectId={projectId}
          fileId={fileId}
        />
      </div>
    </div>
  );
}
