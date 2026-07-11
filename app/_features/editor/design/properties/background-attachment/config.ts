import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";

export const ATTACHMENT_VALUES = ["fixed", "local", "scroll"] as const;

export const config = {
  features: {
    backgroundAttachment: feature.enum({
      prefix: "bg",
      classes: getEnumClasses("bg", ATTACHMENT_VALUES),
    }),
  },
} satisfies DesignPropertyConfig;
