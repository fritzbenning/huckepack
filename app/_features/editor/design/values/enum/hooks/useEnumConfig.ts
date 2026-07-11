import type { DesignPropertyConfig } from "@editor/design/registry";
import type { SelectOption } from "@shared/ui-kit/ui/SelectList";
import { useMemo } from "react";
import { isEnumFeature } from "../check/isEnumFeature";
import type { EnumFeature } from "../types";
import { getSelectOptionsFromClasses } from "../value/getSelectOptionsFromClasses";

interface UseEnumConfigParams {
  config: DesignPropertyConfig;
  featurePrefix: string;
}

type EnumConfigReturn = EnumFeature & {
  prefix: string;
  options: SelectOption[];
  arbitraryConfig?: {
    format: (value: unknown) => string;
    parse: (inner: string) => unknown | null;
  };
};

export function useEnumConfig({ config, featurePrefix }: UseEnumConfigParams): EnumConfigReturn {
  const feature = config.features[featurePrefix] as EnumFeature;

  const options = useMemo<SelectOption[]>(() => {
    if (!feature) {
      console.warn(`Feature ${featurePrefix} not found in config`);
      return [];
    }

    if (!isEnumFeature(feature)) {
      console.warn(`Feature ${featurePrefix} is not an EnumFeature`);
      return [];
    }

    return getSelectOptionsFromClasses(feature.classes, feature.prefix);
  }, [featurePrefix, feature]);

  return {
    ...feature,
    prefix: feature.prefix,
    options,
  };
}
