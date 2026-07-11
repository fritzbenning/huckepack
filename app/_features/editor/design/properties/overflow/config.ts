import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";
import { IconArrowsHorizontal, IconArrowsVertical } from "@tabler/icons-react";

export const OVERFLOW_VALUES = ["auto", "hidden", "clip", "visible", "scroll"] as const;

export const config = {
  features: {
    overflow: feature.enum({
      prefix: "overflow",
      classes: getEnumClasses("overflow", OVERFLOW_VALUES),
    }),
    overflowX: feature.enum({
      prefix: "overflow-x",
      classes: getEnumClasses("overflow-x", OVERFLOW_VALUES),
      icon: IconArrowsHorizontal,
      placeholder: "X",
    }),
    overflowY: feature.enum({
      prefix: "overflow-y",
      classes: getEnumClasses("overflow-y", OVERFLOW_VALUES),
      icon: IconArrowsVertical,
      placeholder: "Y",
    }),
  },
  individualMode: {
    unified: "overflow",
    individual: ["overflowX", "overflowY"],
  },
} satisfies DesignPropertyConfig;
