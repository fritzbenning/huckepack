import type { DesignCategory, DropdownValue } from "@editor/design/ui/design-category/types";
import type { DesignPropertyFeatureType } from "@editor/design/values/types";
import type { ComponentType } from "react";
import type { IndividualModeConfig } from "../modes/individual-mode";
import type { DesignPropertyComponentProps } from "../ui/design-rule/types";

export type DesignPropertyKey =
  | "flexLayout"
  | "borderRadius"
  | "opacity"
  | "overflow"
  | "visibility"
  | "fontFamily"
  | "fontSize"
  | "fontWeight"
  | "textColor"
  | "letterSpacing"
  | "padding"
  | "margin"
  | "width"
  | "height"
  | "minWidth"
  | "maxWidth"
  | "minHeight"
  | "maxHeight"
  | "aspectRatio"
  | "position"
  | "zIndex"
  | "backgroundColor"
  | "backgroundImage"
  | "backgroundSize"
  | "backgroundPosition"
  | "backgroundRepeat"
  | "backgroundOrigin"
  | "backgroundAttachment"
  | "backgroundClip";

export type DesignPropertyFeature = {
  [key: string]: DesignPropertyFeatureType;
};

export type DesignPropertyConfig = {
  features: DesignPropertyFeature;
  individualMode?: IndividualModeConfig;
};

export type UnitConfig = {
  toPx: (value: number) => number;
  fromPx: (valueInPx: number) => number;
};

export type DesignPropertyDependencies = {
  requires?: DesignPropertyKey[];
  showWhen?: (presentProperties: Record<DesignPropertyKey, boolean>) => boolean;
};

export type DesignPropertyRegistryEntry = {
  key: DesignPropertyKey;
  category: DesignCategory;
  displayName: string;
  config: DesignPropertyConfig;
  component: ComponentType<DesignPropertyComponentProps>;
  dependencies?: DesignPropertyDependencies;
  getDropdownValues: (presentProperties: Record<DesignPropertyKey, boolean>) => DropdownValue[];
};

export type ShorthandRegistryEntry = {
  shorthand: string;
  expandsTo: string[];
};
