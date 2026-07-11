import type { Span } from "@swc/wasm-web";

export function getSpan(node: unknown): Span {
  if (node && typeof node === "object" && "span" in node) {
    const nodeWithSpan = node as { span?: Span };
    if (nodeWithSpan.span) {
      return nodeWithSpan.span;
    }
  }

  return { start: 0, end: 0, ctxt: 0 };
}
