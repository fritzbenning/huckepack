import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";
import { getScaleClasses, TAILWIND_SCALES } from "@editor/design/values/numeric";
import { zIndexNormalizer } from "./normalizers";

export const config = {
  features: {
    zIndex: feature.numeric({
      prefix: "z",
      classes: [...getScaleClasses("z", TAILWIND_SCALES), ...getEnumClasses("z", ["auto"])],
      extensions: {
        enum: {
          values: ["auto"],
          defaultValue: "auto",
        },
      },
      normalizer: zIndexNormalizer,
    }),
  },
} satisfies DesignPropertyConfig;
