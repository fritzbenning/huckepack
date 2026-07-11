import type { DesignPropertyConfig } from "@editor/design/registry";
import { useNumericConfig } from "@editor/design/values/numeric";
import { DesignValueInput } from "@shared/ui-kit/editor/ui/DesignValueInput";
import { useEnumValue } from "../../enum/hooks/useEnumValue";

interface NumericEnumExtentionInputProps {
  featurePrefix: string;
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  className?: string;
  placeholder?: string;
}

export function NumericEnumExtentionInput({
  featurePrefix,
  config,
  classTokens,
  astPosition,
  projectId,
  fileId,
  className,
}: NumericEnumExtentionInputProps) {
  const { prefix, placeholder, enumOptions } = useNumericConfig({ config, featurePrefix });

  const { value, onEnumChange } = useEnumValue({
    config,
    featurePrefix,
    classTokens,
    prefix,
    astPosition,
    projectId,
    fileId,
  });

  return (
    <DesignValueInput
      className={className}
      isTokenMode={true}
      selectOptions={enumOptions}
      selectValue={value}
      onSelectChange={onEnumChange}
      placeholder={placeholder ?? "Select value"}
    />
  );
}
