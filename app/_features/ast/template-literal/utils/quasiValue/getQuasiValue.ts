import type { TemplateElement } from "@swc/wasm-web";

/**
 * Gets the value from a template element (quasi), preferring cooked over raw.
 */
export function getQuasiValue(quasi: TemplateElement): string {
  return quasi.cooked || quasi.raw || "";
}

