import type { DesignPropertyRegistryEntry } from "@editor/design/registry/types";

export type DesignCategory =
  | "Position"
  | "Dimensions"
  | "Layout"
  | "Spacing"
  | "Background"
  | "Stroke"
  | "Appearance"
  | "Typography"
  | "Effects"
  | "Animation";

export interface CategoryConfig {
  name: DesignCategory;
  rules: DesignPropertyRegistryEntry[];
}

export type DropdownValue = {
  classToAdd: string;
  label: string;
  siblingClasses: string[];
};

