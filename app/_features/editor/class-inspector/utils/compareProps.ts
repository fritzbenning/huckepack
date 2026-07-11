import type { ExpressionSegment } from "@editor/class-manager/types";

export function areSegmentsEqual(a: ExpressionSegment | undefined, b: ExpressionSegment | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.span?.start === b.span?.start;
}
