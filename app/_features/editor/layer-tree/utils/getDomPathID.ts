import type { Identifier, JSXOpeningElement } from "@swc/wasm-web";

export function getDomPathID(opening: JSXOpeningElement, siblingIndex: number, parentId: string = ""): string {
  const tagName = (opening.name as Identifier).value;
  const segment = `${tagName}[${siblingIndex}]`;

  return parentId ? `${parentId}>${segment}` : segment;
}
