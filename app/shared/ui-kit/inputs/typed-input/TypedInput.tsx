import type { Id } from "@convex/_generated/dataModel";
import { useStoreFiles } from "@project/file-manager";
import { Input } from "@shared/ui-kit/inputs/input";
import { Select } from "@shared/ui-kit/inputs/select/Select";
import { Switch } from "@shared/ui-kit/inputs/switch";
import { useMemo } from "react";
import type { TypedInputProps } from "./types";

export function TypedInput({
  type,
  value,
  onChange,
  id,
  placeholder,
  disabled = false,
  className = "flex-1",
  dimension = "small",
  tone = "emphasized",
  projectId,
  fileId,
}: TypedInputProps) {
  const propType = type.kind;
  const unionOptions = type.unionOptions;
  const allFiles = useStoreFiles((projectId || ("" as Id<"projects">)) as Id<"projects">);

  // Check if this is an instance type (either "instance" or "ReactNode")
  const isInstanceType = propType === "ReactNode" || propType === "React.ReactNode";

  // For instance type, prepare file options
  const fileOptions = useMemo(() => {
    if (!isInstanceType || !projectId) return [];
    return allFiles
      .filter((file) => {
        // Exclude current file
        if (file.id === fileId) return false;
        // Only include files that have an export (component files)
        if (!file.export) return false;
        return true;
      })
      .map((file) => ({
        value: file.id,
        label: file.name,
      }));
  }, [isInstanceType, projectId, fileId, allFiles]);

  // Default placeholders based on type
  const defaultPlaceholder =
    placeholder ?? (propType === "union" ? "Select value" : propType === "number" ? "Enter number" : "Enter value");

  if (propType === "boolean") {
    return (
      <Switch
        id={id}
        checked={value === true || value === "true"}
        onCheckedChange={onChange}
        size="small"
        disabled={disabled}
        className={className}
      />
    );
  }

  if (isInstanceType && projectId) {
    return (
      <Select
        options={fileOptions}
        value={value !== null && value !== undefined ? String(value) : ""}
        onChange={(selectedValue) => {
          if (selectedValue) {
            onChange(selectedValue);
          }
        }}
        placeholder={placeholder ?? "Select instance"}
        className={className}
        dimension={dimension}
        tone={tone}
        disabled={disabled}
      />
    );
  }

  if (propType === "union" && unionOptions) {
    return (
      <Select
        options={unionOptions.map((option: string | number) => ({
          value: String(option),
          label: String(option),
        }))}
        value={value !== null && value !== undefined ? String(value) : ""}
        onChange={(selectedValue) => {
          if (selectedValue) {
            const foundValue = unionOptions.find((opt: string | number) => String(opt) === selectedValue);
            if (foundValue !== undefined) {
              onChange(typeof foundValue === "number" ? foundValue : foundValue);
            }
          }
        }}
        placeholder={defaultPlaceholder}
        className={className}
        dimension={dimension}
        tone={tone}
        disabled={disabled}
      />
    );
  }

  if (propType === "number") {
    return (
      <Input
        id={id}
        type="number"
        value={value !== null && value !== undefined ? String(value) : ""}
        onChange={(inputValue) => {
          const numValue = inputValue === "" ? 0 : Number(inputValue);
          if (!Number.isNaN(numValue)) {
            onChange(numValue);
          }
        }}
        placeholder={defaultPlaceholder}
        className={className}
        dimension={dimension}
        tone={tone}
        instant={true}
        disabled={disabled}
      />
    );
  }

  // Default: text input
  return (
    <Input
      id={id}
      value={value !== null && value !== undefined ? String(value) : ""}
      onChange={onChange}
      placeholder={defaultPlaceholder}
      className={className}
      dimension={dimension}
      tone={tone}
      instant={true}
      disabled={disabled}
    />
  );
}
