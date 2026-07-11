import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { isFontSizeClass } from "@editor/design/shared/helpers/classifier/text";
import { getTokenClasses } from "@editor/design/values/numeric";
import { TAILWIND_FONT_SIZE_TOKENS } from "@editor/design/values/token";

export const config = {
  features: {
    fontSize: feature.numeric({
      prefix: "text",
      classes: getTokenClasses("text", TAILWIND_FONT_SIZE_TOKENS),
      extensions: {
        tokens: TAILWIND_FONT_SIZE_TOKENS,
      },
      defaultUnit: "rem",
      units: ["px", "%", "rem", "em", "vw", "vh"],
      classFilter: isFontSizeClass,
    }),
  },
} satisfies DesignPropertyConfig;
