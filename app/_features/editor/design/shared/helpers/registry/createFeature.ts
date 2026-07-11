import type { EnumFeature } from "@editor/design/values/enum/types";
import type { NumericFeature } from "@editor/design/values/numeric/types";
import type { StringFeature } from "@editor/design/values/string/types";
import type { ColorFeature, PercentValueFeature, ToggleFeature } from "@editor/design/values/types";

export const feature = {
  enum: (f: Omit<EnumFeature, "type">): EnumFeature => ({
    ...f,
    type: "enum",
  }),

  numeric: (f: Omit<NumericFeature, "type">): NumericFeature => ({
    ...f,
    type: "numeric",
  }),

  toggle: (f: Omit<ToggleFeature, "type">): ToggleFeature => ({
    ...f,
    type: "toggle",
  }),

  percent: (f: Omit<PercentValueFeature, "type">): PercentValueFeature => ({
    ...f,
    type: "percentValue",
  }),

  color: (f: Omit<ColorFeature, "type">): ColorFeature => ({
    ...f,
    type: "color",
  }),

  string: (f: Omit<StringFeature, "type">): StringFeature => ({
    ...f,
    type: "string",
  }),
};
