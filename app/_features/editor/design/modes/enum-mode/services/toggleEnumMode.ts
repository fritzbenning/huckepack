import type { DesignPropertyConfig } from "@editor/design/registry";
import { updateDesignProperty } from "@editor/design/shared/helpers/class-handler";
import { getArbitraryExtentionFromFeature, getCurrentFeatureClass } from "@editor/design/shared/utils";
import { isEnumFeature } from "@editor/design/values/enum";
import { getEnumValues } from "@editor/design/values/enum/value/getEnumValues";
import { getLinkedValues } from "@editor/design/values/enum/value/getLinkedValues";
import { isNumericFeature } from "@editor/design/values/numeric/check";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";
import { transformClassToEnum, transformClassToNumeric } from "../transformers";

export interface NumericTargetValue {
  value: number;
  unit: Unit;
}

interface ToggleEnumModeParams {
  toEnumMode: boolean;
  config: DesignPropertyConfig;
  featurePrefix: string;
  prefix: string;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  numericTargetValue?: NumericTargetValue;
}

/**
 * Toggles between enum mode and value/arbitrary mode for a design property.
 * When enabled: converts value/arbitrary classes to enum classes (e.g., "w-[100px]" → "w-auto").
 * When disabled: converts enum classes to arbitrary/numeric classes (e.g., "w-auto" → "w-[100px]").
 */
export async function toggleEnumMode({
  toEnumMode,
  config,
  featurePrefix,
  prefix,
  classTokens,
  astPosition,
  projectId,
  fileId,
  numericTargetValue,
}: ToggleEnumModeParams): Promise<void> {
  if (!astPosition) return;

  const feature = config.features[featurePrefix];

  if (!feature) {
    throw new Error(`Feature ${featurePrefix} not found in config`);
  }

  const currentClass = getCurrentFeatureClass(config, classTokens, featurePrefix);
  const arbitraryConfig = getArbitraryExtentionFromFeature(feature);

  const enumValues = getEnumValues(config, classTokens, featurePrefix);

  let defaultUnit: Unit | null = null;
  let linkedValues: Map<string, unknown> = new Map();
  let defaultEnumValue: string | undefined = enumValues[0];

  if (isNumericFeature(feature)) {
    linkedValues = getLinkedValues(feature.extensions?.enum?.values);
    defaultUnit = feature.defaultUnit ?? null;
    defaultEnumValue = feature.extensions?.enum?.defaultValue ?? enumValues[0];
  }

  if (isEnumFeature(feature)) {
    defaultEnumValue = feature.defaultValue ?? enumValues[0];
  }

  let classToAdd: string | null = null;

  if (toEnumMode) {
    classToAdd = transformClassToEnum({
      prefix,
      defaultUnit,
      linkedValues,
      defaultEnumValue,
      currentClass,
      classTokens,
      arbitraryConfig,
    });
  } else {
    classToAdd = transformClassToNumeric({
      prefix,
      linkedValues,
      currentClass,
      classTokens,
      numericTargetValue,
      defaultUnit,
      arbitraryConfig,
    });
  }

  if (!classToAdd) return;

  await updateDesignProperty({
    config,
    featurePrefix,
    classTokens,
    newClass: classToAdd,
    astPosition,
    projectId,
    fileId,
  });
}
