import type { ColorFeature } from "../types";

export function isColorFeature(feature: unknown): feature is ColorFeature {
  return (
    typeof feature === "object" &&
    feature !== null &&
    "type" in feature &&
    feature.type === "color"
  );
}

