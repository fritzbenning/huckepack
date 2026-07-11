import type { Span } from "@swc/wasm-web";

export interface ExternalDependency {
  name: string;
  version?: string;
  importType: "default" | "named" | "namespace" | "side-effect";
  importedNames: string[];
}

export type ExportType = "named" | "default" | "namespace" | "none";

export interface PropertyType {
  kind: string;
  rawKind: string;
  unionOptions?: string[] | number[] | null;
}

export interface Property {
  type: PropertyType;
  optional: boolean;
}

export type Properties = Record<string, Property>;

export interface FormattedParam {
  type: string;
  defaultValue: string | number | boolean | null;
  span?: Span;
}
