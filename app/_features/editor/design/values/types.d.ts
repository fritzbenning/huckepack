import type { EnumFeature } from "./enum";
import type { NumericFeature } from "./numeric";
import type { StringFeature } from "./string";

export type BaseFeature<T extends string = string> = {
  type: T;
  prefix: string;
  classes: string[];
};

export type EnumValueDef<T = unknown> = string | { name: string; linkedValue?: T | null };

export type EnumExtentionConfig<T = unknown> = {
  values: EnumValueDef<T>[];
  defaultValue: string;
};

export type ArbitraryConfig = {
  format: (value: unknown) => string;
  parse: (inner: string) => unknown | null;
};

export type ToggleFeature = BaseFeature<"toggle"> & {
  defaultValue?: boolean;
};

export type PercentValueFeature = BaseFeature<"percentValue"> & {
  prefix: string;
  exactValues: number[];
  defaultValue: number;
  range: { min: number; max: number };
  displayAs?: "percent" | "decimal";
};

export type ColorFeature = BaseFeature<"color"> & {
  prefix: string;
  enumMap?: string[];
};

export type DesignPropertyFeatureType =
  | EnumFeature
  | ToggleFeature
  | NumericFeature
  | PercentValueFeature
  | ColorFeature
  | StringFeature;
