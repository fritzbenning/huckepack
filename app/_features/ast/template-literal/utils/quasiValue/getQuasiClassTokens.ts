import { splitClassTokens } from "@ast/utils";
import type { TemplateElement } from "@swc/wasm-web";
import { getQuasiValue } from "./getQuasiValue";

/**
 * Gets class tokens from a quasi value.
 */
export function getQuasiClassTokens(quasi: TemplateElement): string[] {
  return splitClassTokens(getQuasiValue(quasi));
}

