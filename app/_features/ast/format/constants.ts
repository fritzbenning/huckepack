import type { DprintFormatConfig } from "./types";

export const DEFAULT_DPRINT_CONFIG: Required<
  Pick<DprintFormatConfig, "lineWidth" | "indentWidth" | "useTabs" | "newLineKind">
> = {
  lineWidth: 80,
  indentWidth: 2,
  useTabs: false,
  newLineKind: "lf",
};
