import type { DesignPropertyConfig } from "@editor/design/registry";
import { updateDesignProperty } from "@editor/design/shared/helpers/class-handler";
import { getCurrentFeatureClass } from "@editor/design/shared/utils";
import { useMemo } from "react";
import { createEnumClass } from "../classes/create/createEnumClass";
import type { EnumFeature } from "../types";
import { extractEnumValue } from "../value/extractEnumValue";

interface UseEnumValueParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  classTokens: string[] | null;
  prefix: string;
  astPosition?: number | null;
  projectId?: string;
  fileId?: string;
  defaultValue?: string;
}

interface UseEnumValueResult {
  value: string | undefined;
  onEnumChange?: (enumClass: string) => Promise<void>;
}

/**
 * Hook that extracts the enum value from a feature class.
 * Optionally provides a change handler if update parameters are provided.
 * Handles compressed prefixes (e.g., "size" for width/height) by expanding shorthand classes
 * and preserving non-matching expanded classes when updating.
 */
export function useEnumValue({
  config,
  featurePrefix,
  classTokens,
  prefix,
  astPosition,
  projectId,
  fileId,
}: UseEnumValueParams): UseEnumValueResult {
  const currentValue = useMemo(() => {
    const feature = config.features[featurePrefix] as EnumFeature;

    const computedCurrentClass = getCurrentFeatureClass<string>(config, classTokens, featurePrefix);

    const enumValue = extractEnumValue(computedCurrentClass, prefix);
    const defaultEnumValue = feature.defaultValue ? extractEnumValue(feature.defaultValue, prefix) : undefined;

    return enumValue ?? defaultEnumValue;
  }, [config, featurePrefix, classTokens, prefix]);

  const onEnumChange = async (value: string) => {
    if (!astPosition || !projectId || !fileId) {
      return;
    }

    const newEnumClass = createEnumClass(value, prefix);

    await updateDesignProperty({
      config,
      featurePrefix,
      classTokens: classTokens,
      newClass: newEnumClass,
      astPosition,
      projectId,
      fileId,
    });
  };

  return {
    value: currentValue,
    onEnumChange,
  };
}
