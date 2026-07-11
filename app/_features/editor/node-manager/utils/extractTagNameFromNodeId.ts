export function extractTagNameFromNodeId(nodeIdSegment: string): string {
  const match = nodeIdSegment.match(/^([^[]+)\[/);
  return match ? match[1] : "";
}
