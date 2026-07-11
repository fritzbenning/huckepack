import type { DesignPropertyConfig } from "@editor/design/registry";
import { DesignValueInput } from "@shared/ui-kit/editor/ui/DesignValueInput";
import { useEffect } from "react";
import { useStringValue } from "../hooks/useStringValue";

interface StringValueInputProps {
  featurePrefix: string;
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  className?: string;
  placeholder?: string;
  showClear?: boolean;
  onClear?: () => void;
  compressedPrefix?: string;
  onValue?: (value: string) => void;
}

export function StringValueInput({
  featurePrefix,
  config,
  classTokens,
  astPosition,
  projectId,
  fileId,
  className,
  placeholder,
  showClear,
  onClear,
  compressedPrefix,
  onValue,
}: StringValueInputProps) {
  const feature = config.features[featurePrefix];

  if (!feature || feature.type !== "string") {
    throw new Error(`Feature ${featurePrefix} must be of type "string" to use StringValueInput`);
  }

  const { value, onValueChange } = useStringValue({
    config,
    featurePrefix,
    classTokens,
    astPosition,
    projectId,
    fileId,
    compressedPrefix,
  });

  useEffect(() => {
    onValue?.(value);
  }, [value, onValue]);

  const hasValue = value !== "" && value !== undefined;
  const featurePlaceholder = feature.placeholder;
  const finalPlaceholder = placeholder ?? (hasValue ? featurePlaceholder : "unset");

  const shouldShowClear = showClear ?? (hasValue && !!onClear);

  return (
    <DesignValueInput
      className={className}
      placeholder={finalPlaceholder}
      inputValue={value}
      onInputChange={onValueChange}
      showUnitSelector={false}
      showClear={shouldShowClear}
      onClear={onClear}
      icon={feature.icon}
    />
  );
}
