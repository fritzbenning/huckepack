export function extractIndexFromNodeId(nodeIdSegment: string): number {
  const match = nodeIdSegment.match(/\[(\d+)\]/);
  return match ? parseInt(match[1], 10) : 0;
}
