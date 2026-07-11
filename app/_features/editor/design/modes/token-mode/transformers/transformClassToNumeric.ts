import type { DesignPropertyConfig } from "@editor/design/registry";
import {
  convertTokenToCustomValue,
  convertTokenToScaleValue,
  getCurrentFeatureClass,
  normalizePrefix,
} from "@editor/design/shared/utils";
import type { TokenMap } from "@editor/design/values/token/types";
import { extractTokenValue } from "@editor/design/values/token/value/extractTokenValue";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";

interface TransformClassesToNumericParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  prefix: string;
  classTokens: string[] | null;
  tokenMap: TokenMap;
  targetUnit: Unit;
}

export function transformClassToNumeric({
  config,
  featurePrefix,
  prefix,
  classTokens,
  tokenMap,
  targetUnit,
}: TransformClassesToNumericParams): string | null {
  const currentClass = getCurrentFeatureClass(config, classTokens, featurePrefix);

  if (!currentClass) return null;

  const normalizedPrefix = normalizePrefix(prefix, true);

  if (currentClass.includes("[")) {
    return null;
  }

  const token = extractTokenValue(currentClass, normalizedPrefix, tokenMap);

  if (token === null) {
    return null;
  }

  const numericValue =
    targetUnit === "scale"
      ? convertTokenToScaleValue(token, tokenMap, normalizedPrefix)
      : convertTokenToCustomValue(token, tokenMap, normalizedPrefix, targetUnit);

  return numericValue ?? null;
}
