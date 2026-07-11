import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";

export const FONT_WEIGHT_VALUES = [
  "thin",
  "extralight",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "extrabold",
  "black",
] as const;

export const config = {
  features: {
    fontWeight: feature.enum({
      prefix: "font",
      classes: getEnumClasses("font", FONT_WEIGHT_VALUES),
    }),
  },
} satisfies DesignPropertyConfig;
