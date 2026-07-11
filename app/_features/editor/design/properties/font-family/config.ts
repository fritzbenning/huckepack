import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getEnumClasses } from "@editor/design/values/enum";
import { GOOGLE_FONTS, STANDARD_FONTS } from "./constants";

const EXACT_FONT_CLASSES = getEnumClasses("font", STANDARD_FONTS);
const GOOGLE_FONT_CLASSES = GOOGLE_FONTS.map((font) => `font-[${font.replace(/\s+/g, "_")}]`);

export const config = {
  features: {
    standard: feature.enum({
      prefix: "font",
      classes: EXACT_FONT_CLASSES,
    }),
    google: feature.enum({
      prefix: "font",
      classes: GOOGLE_FONT_CLASSES,
    }),
  },
} satisfies DesignPropertyConfig;
