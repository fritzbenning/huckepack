import type { DesignPropertyConfig } from "@editor/design/registry";
import { getUnifiedPrefix } from "@editor/design/shared/utils";
import type { Icon } from "@phosphor-icons/react";
import { DesignValueInput } from "@shared/ui-kit/editor/ui/DesignValueInput";
import { useEffect, useState } from "react";
import { useNumericConfig } from "../hooks";
import { useNumericValue } from "../hooks/useNumericValue";

interface NumericValueInputProps {
  featurePrefix: string;
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  className?: string;
  hideUnitLabel?: boolean;
  icon?: Icon | string;
  showClear?: boolean;
  onClear?: () => void;
  tone?: "subtle" | "emphasized";
  inputClassName?: string;
  allowNegative?: boolean;
}

export function NumericValueInput({
  featurePrefix,
  config,
  classTokens,
  astPosition,
  projectId,
  fileId,
  className,
  hideUnitLabel = false,
  icon,
  showClear = false,
  onClear,
  tone,
  inputClassName,
  allowNegative,
}: NumericValueInputProps) {
  const { placeholder } = useNumericConfig({ config, featurePrefix });

  const unifiedPrefix = getUnifiedPrefix(config, featurePrefix);

  const { value, onValueChange, unit, onUnitChange, availableUnits } = useNumericValue({
    config,
    featurePrefix,
    classTokens,
    astPosition,
    projectId,
    fileId,
    unifiedPrefix,
    allowNegative,
  });

  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    // Preventing placeholder flickering
    setShowPlaceholder(true);
  }, []);

  return (
    <DesignValueInput
      className={className}
      placeholder={showPlaceholder ? placeholder : undefined}
      inputValue={value}
      onInputChange={onValueChange}
      unit={unit}
      hideUnitLabel={hideUnitLabel}
      onUnitChange={onUnitChange}
      availableUnits={availableUnits}
      icon={icon}
      showClear={showClear}
      onClear={onClear}
      tone={tone}
      inputClassName={inputClassName}
    />
  );
}
