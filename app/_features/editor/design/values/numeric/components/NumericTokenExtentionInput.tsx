import { useTokenMode } from "@editor/design/modes/token-mode";
import type { DesignPropertyConfig } from "@editor/design/registry";
import { getUnifiedPrefix } from "@editor/design/shared/utils";
import { useNumericConfig } from "@editor/design/values/numeric";
import { LinkBreakIcon, SwatchesIcon } from "@phosphor-icons/react";
import { DesignValueInput } from "@shared/ui-kit/editor/ui/DesignValueInput";
import { useTokenValue } from "../../token";
import { useNumericValue } from "../hooks/useNumericValue";

interface NumericTokenExtentionInputProps {
  featurePrefix: string;
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  className?: string;
  hideUnitLabel?: boolean;
  compressedPrefix?: string;
}

export function NumericTokenExtentionInput({
  featurePrefix,
  config,
  classTokens,
  astPosition,
  projectId,
  fileId,
  className,
  hideUnitLabel = false,
}: NumericTokenExtentionInputProps) {
  const { tokenOptions, tokens, prefix, defaultUnit, placeholder } = useNumericConfig({ config, featurePrefix });

  const unifiedPrefix = getUnifiedPrefix(config, featurePrefix);

  const { value, unit, onValueChange, onUnitChange, availableUnits } = useNumericValue({
    config,
    featurePrefix,
    classTokens,
    astPosition,
    projectId,
    fileId,
    unifiedPrefix,
  });

  const { token, onChange } = useTokenValue({
    config,
    featurePrefix,
    classTokens,
    astPosition,
    projectId,
    fileId,
  });

  const { isTokenMode, toggle } = useTokenMode({
    config,
    featurePrefix,
    tokens,
    classTokens,
    prefix,
    astPosition,
    projectId,
    fileId,
    numericTargetUnit: defaultUnit ?? "px",
  });

  return (
    <DesignValueInput
      isTokenMode={isTokenMode}
      className={className}
      placeholder={placeholder}
      selectOptions={tokenOptions}
      selectValue={token}
      onSelectChange={onChange}
      inputValue={value}
      onInputChange={onValueChange}
      unit={unit}
      hideUnitLabel={hideUnitLabel}
      onUnitChange={onUnitChange}
      availableUnits={availableUnits}
      actionIcon={toggle ? (isTokenMode ? LinkBreakIcon : SwatchesIcon) : undefined}
      onActionClick={toggle}
    />
  );
}
