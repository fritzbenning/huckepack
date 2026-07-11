import type { DesignPropertyConfig } from "@editor/design/registry";
import { updateDesignProperty } from "@editor/design/shared/helpers/class-handler";
import type { TokenMap } from "@editor/design/values/token/types";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";
import { transformClassToNumeric, transformClassToToken } from "../transformers";

interface ToggleTokenModeParams {
  toTokenMode: boolean;
  config: DesignPropertyConfig;
  featurePrefix: string;
  prefix: string;
  tokenMap: TokenMap;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  numericTargetUnit?: Unit;
}

/**
 * Toggles between token mode and custom value mode for design properties.
 * When enabled: converts custom values to token classes (e.g., "w-[16px]" → "w-4").
 * When disabled: converts token classes to custom values (e.g., "w-4" → "w-[16px]").
 */
export async function toggleTokenMode({
  toTokenMode,
  config,
  featurePrefix,
  prefix,
  tokenMap,
  classTokens,
  astPosition,
  projectId,
  fileId,
  numericTargetUnit,
}: ToggleTokenModeParams): Promise<void> {
  if (!astPosition) return;

  const feature = config.features[featurePrefix];

  if (!feature) {
    throw new Error(`Feature ${featurePrefix} not found in config`);
  }

  if (!classTokens) return;

  let classToAdd: string | null = null;

  if (toTokenMode) {
    classToAdd = transformClassToToken({
      config,
      featurePrefix,
      prefix,
      classTokens,
      tokenMap,
    });
  } else {
    const targetUnit = numericTargetUnit ?? "px";

    classToAdd = transformClassToNumeric({
      config,
      featurePrefix,
      prefix,
      classTokens,
      tokenMap,
      targetUnit,
    });
  }

  if (!classToAdd) return;

  await updateDesignProperty({
    config,
    featurePrefix,
    newClass: classToAdd,
    classTokens,
    astPosition,
    projectId,
    fileId,
  });
}
