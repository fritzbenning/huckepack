import type { Span } from "@swc/wasm-web";

const U32_MAX = 4294967296;

export function createSpan(length = 1): Span {
  const start = Date.now() % U32_MAX;
  return {
    start,
    end: (start + length) % U32_MAX,
    ctxt: 0,
  };
}
