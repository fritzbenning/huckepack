import type { FlexibleIcon } from "@shared/ui-kit/editor/ui/DesignValueInput";
import type { BaseFeature } from "../types";

export type EnumFeature = BaseFeature<"enum"> & {
  icon?: FlexibleIcon;
  placeholder?: string;
  defaultValue?: string;
  disregardedClasses?: string[];
  displayWhen?: (classTokens: string[] | null) => boolean;
};
