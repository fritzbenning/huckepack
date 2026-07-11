import type { TemplateElement } from "@swc/wasm-web";
import { normalizeQuasiValue } from "../normalizeQuasiValue";

/**
 * Updates a quasi with a new value, normalizing spacing and updating the span.
 */
export function updateQuasiValue(
  quasi: TemplateElement,
  newValue: string,
  spacingContext: { hasPrecedingExpression: boolean; hasFollowingExpression: boolean }
): void {
  const normalizedValue = normalizeQuasiValue(newValue, spacingContext);

  quasi.cooked = normalizedValue;
  quasi.raw = normalizedValue;
  quasi.span.end = quasi.span.start + normalizedValue.length;
}

