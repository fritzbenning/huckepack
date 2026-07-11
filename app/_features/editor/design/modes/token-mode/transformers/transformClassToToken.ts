import type { DesignPropertyConfig } from "@editor/design/registry";
import {
  convertCustomValueToToken,
  convertScaleValueToToken,
  getCurrentFeatureClass,
  normalizePrefix,
} from "@editor/design/shared/utils";
import { createTokenClass } from "@editor/design/values/token/classes/create/createTokenClass";
import type { TokenMap } from "@editor/design/values/token/types";
import { extractTokenValue } from "@editor/design/values/token/value/extractTokenValue";

interface TransformClassesToTokensParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
  prefix: string;
  classTokens: string[] | null;
  tokenMap: TokenMap;
}

export function transformClassToToken({
  config,
  featurePrefix,
  prefix,
  classTokens,
  tokenMap,
}: TransformClassesToTokensParams): string | null {
  const currentClass = getCurrentFeatureClass(config, classTokens, featurePrefix);

  if (!currentClass) return null;

  const normalizedPrefix = normalizePrefix(prefix, true);

  if (currentClass.includes("[")) {
    const token = convertCustomValueToToken(currentClass, tokenMap, normalizedPrefix);

    if (token) {
      const tokenClass = createTokenClass(token, normalizedPrefix, tokenMap);

      return tokenClass;
    }
  } else {
    const existingToken = extractTokenValue(currentClass, normalizedPrefix, tokenMap);

    if (existingToken === null) {
      const scaleToken = convertScaleValueToToken(currentClass, tokenMap, normalizedPrefix);

      if (scaleToken) {
        const tokenClass = createTokenClass(scaleToken, normalizedPrefix, tokenMap);

        return tokenClass;
      }
    }
  }

  return null;
}
