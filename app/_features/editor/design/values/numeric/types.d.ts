import type { ClassNormalizer } from "@editor/design/shared/helpers/normalizer/types";
import type { TokenMap } from "@editor/design/values/token/types";
import type { Unit } from "@shared/ui-kit/editor/ui/UnitSelect";
import type { ArbitraryConfig, BaseFeature, EnumExtentionConfig } from "../types";

export type NumericFeature = BaseFeature<"numeric"> & {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | string;
  placeholder?: string;
  units?: ("scale" | "px" | "%" | "rem" | "em" | "vw" | "vh")[];
  defaultUnit?: "scale" | "px" | "rem" | "em";
  normalizer?: ClassNormalizer;
  classFilter?: (className: string) => boolean;
  compressedPrefix?: string;
  defaultValue?: number;
  extensions?: {
    tokens?: TokenMap;
    enum?: EnumExtentionConfig;
    arbitrary?: ArbitraryConfig;
  };
};

export interface NumericValue {
  value: number;
  unit: Unit;
}
