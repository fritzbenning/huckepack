import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";

export const VISIBILITY_VALUES = ["visible", "invisible"] as const;

const visibilityClasses = getEnumClasses("", VISIBILITY_VALUES);

export const config = {
  features: {
    visibility: feature.enum({
      prefix: "",
      classes: visibilityClasses,
    }),
  },
} satisfies DesignPropertyConfig;
