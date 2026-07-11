import type { TemplateElement } from "@swc/wasm-web";
import { getQuasiValue } from "./getQuasiValue";

/**
 * Finds the first quasi with content, or returns the first quasi if none have content.
 */
export function findTargetQuasi(quasis: TemplateElement[]): {
  quasi: TemplateElement;
  index: number;
} | null {
  if (quasis.length === 0) return null;

  // First, try to find a quasi with content
  for (let i = 0; i < quasis.length; i++) {
    const quasi = quasis[i];
    const value = getQuasiValue(quasi);
    if (value.trim()) {
      return { quasi, index: i };
    }
  }

  // If no quasi with content found, use the first one
  return { quasi: quasis[0], index: 0 };
}

