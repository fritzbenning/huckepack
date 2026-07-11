import type { BaseFeature } from "../types";

export type StringFeature = BaseFeature<"string"> & {
  placeholder?: string;
  emptyValue?: string;
  formatValue?: (value: string) => string;
  parseValue?: (value: string) => string | undefined;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | string;
};
