import type { DesignPropertyConfig } from "@editor/design/registry";
import type { SelectOption } from "@shared/ui-kit/ui/SelectList";
import { useMemo } from "react";
import { getSelectOptionsFromExtention } from "../../enum";
import type { TokenMap } from "../../token/types";
import { isNumericFeature } from "../check/isNumericFeature";
import type { NumericFeature } from "../types";

interface UseNumericConfigParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
}

type NumericConfigReturn = NumericFeature & {
  prefix: string;
  enumOptions: SelectOption[];
  tokenOptions: SelectOption[];
  tokens: TokenMap | null;
};

export function useNumericConfig({ config, featurePrefix }: UseNumericConfigParams): NumericConfigReturn {
  const feature = config.features[featurePrefix] as NumericFeature;

  const enumOptions = useMemo<SelectOption[]>(() => {
    if (!feature) {
      throw new Error(`Feature ${featurePrefix} not found in config`);
    }

    if (!isNumericFeature(feature)) {
      return [];
    }

    if (feature.extensions?.enum) {
      return getSelectOptionsFromExtention(feature.extensions.enum.values);
    }

    return [];
  }, [featurePrefix, feature]);

  const tokenOptions = useMemo<SelectOption[]>(() => {
    if (!feature) {
      throw new Error(`Feature ${featurePrefix} not found in config`);
    }

    if (!isNumericFeature(feature)) {
      return [];
    }

    const tokens = feature.extensions?.tokens;

    if (tokens) {
      return getSelectOptionsFromExtention(Object.keys(tokens));
    }

    return [];
  }, [featurePrefix, feature]);

  return {
    ...feature,
    prefix: feature.prefix,
    enumOptions,
    tokenOptions,
    tokens: feature.extensions?.tokens ?? null,
    defaultUnit: feature.defaultUnit,
    defaultValue: feature.defaultValue,
  };
}
