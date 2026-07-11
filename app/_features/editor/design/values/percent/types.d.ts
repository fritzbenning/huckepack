export interface PercentFeature {
  prefix: string;
  exactValues: number[];
  defaultValue: number;
  range: { min: number; max: number };
  displayAs?: "percent" | "decimal";
}

