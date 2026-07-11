import type { DesignPropertyConfig } from "@editor/design/registry";
import { useEnumConfig } from "@editor/design/values/enum";
import { DesignValueInput } from "@shared/ui-kit/editor/ui/DesignValueInput";
import { useEnumValue } from "../hooks";

interface EnumValueInputProps {
  featurePrefix: string;
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  className?: string;
  showClear?: boolean;
  onClear?: () => void;
}

export function EnumValueInput({
  featurePrefix,
  config,
  classTokens,
  astPosition,
  projectId,
  fileId,
  className,
  showClear,
  onClear,
}: EnumValueInputProps) {
  const { prefix, placeholder, icon, options } = useEnumConfig({ config, featurePrefix });

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
      selectOptions={options}
      selectValue={value}
      onSelectChange={onEnumChange}
      placeholder={placeholder ?? "Select value"}
      showClear={showClear}
      onClear={onClear}
      icon={icon}
    />
  );
}
