import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";

const opacityClasses = [
  "opacity-0",
  "opacity-5",
  "opacity-10",
  "opacity-20",
  "opacity-25",
  "opacity-30",
  "opacity-40",
  "opacity-50",
  "opacity-60",
  "opacity-70",
  "opacity-75",
  "opacity-80",
  "opacity-90",
  "opacity-95",
  "opacity-100",
];

export const config = {
  features: {
    opacity: feature.percent({
      prefix: "opacity",
      classes: opacityClasses,
      exactValues: [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100],
      defaultValue: 100,
      range: { min: 0, max: 100 },
      displayAs: "percent",
    }),
  },
} satisfies DesignPropertyConfig;
