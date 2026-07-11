import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { ExpressionSegment } from "@editor/class-manager/types";
import { useEffect, useState } from "react";

export function useConditionalSegments(classes: StringLiteralClasses | TemplateLiteralClasses | null): ExpressionSegment[] {
  const [conditionalSegments, setConditionalSegments] = useState<ExpressionSegment[]>([]);

  useEffect(() => {
    const isTemplateLiteral = classes?.type === "TemplateLiteral";

    if (!isTemplateLiteral) {
      setConditionalSegments([]);
      return;
    }

    const segments = (classes as TemplateLiteralClasses).segments.filter(
      (segment): segment is ExpressionSegment => segment.kind === "expression"
    );
    setConditionalSegments(segments);
  }, [classes]);

  return conditionalSegments;
}

