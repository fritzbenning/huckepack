import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getColorClasses } from "@editor/design/values/color";

export const EXACT_COLOR_VALUES = ["transparent", "inherit", "current", "black", "white"] as const;

export const config = {
  features: {
    backgroundColor: feature.color({
      prefix: "bg",
      classes: getColorClasses("bg", [...EXACT_COLOR_VALUES]),
      enumMap: [...EXACT_COLOR_VALUES],
    }),
  },
} satisfies DesignPropertyConfig;
