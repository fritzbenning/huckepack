import { createSpan } from "@ast/core/create/createSpan";
import type { Identifier } from "@swc/wasm-web";

export function createIdentifier(value: string, ctxt = 0, optional = false): Identifier {
  return {
    type: "Identifier",
    span: createSpan(value.length),
    ctxt,
    value,
    optional,
  } as Identifier;
}
