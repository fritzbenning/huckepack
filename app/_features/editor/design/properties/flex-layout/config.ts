import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { getScaleClasses, TAILWIND_SCALES } from "@editor/design/values/numeric";

const gapClasses = getScaleClasses("gap", TAILWIND_SCALES);

// TODO: toggle feature needs to be built.

export const config = {
  features: {
    display: feature.enum({
      prefix: "",
      classes: ["flex", "inline-flex"],
    }),
    flexDirection: feature.toggle({
      prefix: "flex",
      classes: ["flex-row", "flex-col"],
    }),
    flexWrap: feature.toggle({
      prefix: "flex",
      classes: ["flex-nowrap", "flex-wrap"],
    }),
    justifyBetween: feature.toggle({
      prefix: "justify",
      classes: ["justify-start", "justify-between"],
    }),
    justifyContent: feature.enum({
      prefix: "justify",
      classes: ["justify-start", "justify-center", "justify-end"],
    }),
    alignItems: feature.enum({
      prefix: "items",
      classes: ["items-start", "items-center", "items-end"],
    }),
    gap: feature.numeric({
      prefix: "gap",
      classes: gapClasses,
      defaultUnit: "scale" as const,
    }),
  },
} satisfies DesignPropertyConfig;
