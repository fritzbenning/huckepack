import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getColorClasses } from "@editor/design/values/color";

export const config = {
  features: {
    textColor: feature.color({
      prefix: "text",
      classes: getColorClasses("text", ["transparent", "inherit", "current", "black", "white"]),
      enumMap: ["transparent", "inherit", "current", "black", "white"],
    }),
  },
} satisfies DesignPropertyConfig;
