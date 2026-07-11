import type { DesignPropertyConfig } from "@editor/design/registry";
import { getCurrentFeatureClass } from "@editor/design/shared/utils";
import { isEnumClass } from "@editor/design/values/enum";
import { getEnumValues } from "@editor/design/values/enum/value/getEnumValues";
import { useEffect, useState } from "react";
import type { NumericTargetValue } from "../services/toggleEnumMode";
import { toggleEnumMode } from "../services/toggleEnumMode";

interface UseEnumModeParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  classPrefix: string;
  classTokens?: string[] | null;
  astPosition?: number | null;
  projectId?: string;
  fileId?: string;
  numericTargetValue?: NumericTargetValue;
}

interface UseEnumModeResult {
  isEnumMode: boolean;
  toggle?: () => Promise<void>;
}

/**
 * Detects if the current feature is in enum mode (using enum values like "auto", "full").
 * Optionally provides a toggle function if toggle parameters are provided.
 * Supports both simple enum ↔ numeric and enum ↔ arbitrary value toggling via linkedValue.
 */
export function useEnumMode({
  config,
  featurePrefix,
  classPrefix,
  classTokens,
  astPosition,
  projectId,
  fileId,
  numericTargetValue,
}: UseEnumModeParams): UseEnumModeResult {
  const [isEnumMode, setIsEnumMode] = useState<boolean>(false);

  useEffect(() => {
    const currentClass = getCurrentFeatureClass(config, classTokens, featurePrefix);
    const enumValues = getEnumValues(config, classTokens, featurePrefix);
    const enabled = isEnumClass(enumValues, classPrefix, currentClass);

    setIsEnumMode(enabled);
  }, [config, classTokens, featurePrefix, classPrefix]);

  const toggle = async () => {
    if (!classTokens || astPosition === null || astPosition === undefined || !projectId || !fileId) {
      return;
    }

    await toggleEnumMode({
      toEnumMode: !isEnumMode,
      config,
      featurePrefix,
      prefix: classPrefix,
      classTokens,
      astPosition,
      projectId,
      fileId,
      numericTargetValue,
    });
  };

  return {
    isEnumMode,
    toggle,
  };
}
