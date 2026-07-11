import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import type { ExpressionSegment } from "@editor/class-manager/types";
import { ConditionalClassGroup } from "./ConditionalClassGroup";

interface ConditionalClassesSectionProps {
  conditionalSegments: ExpressionSegment[];
  projectId: string;
  fileId: string;
  selectedNodeAstPosition: number | null;
}

export function ConditionalClassesSection({ conditionalSegments, projectId, fileId }: ConditionalClassesSectionProps) {
  return (
    <AsideSection title="Conditional Classes" contentGap="small">
      {conditionalSegments.map((segment) => (
        <ConditionalClassGroup
          key={`conditional-${segment.expressionType}-${segment.span.start}`}
          segment={segment}
          projectId={projectId}
          fileId={fileId}
        />
      ))}
      {/* <NewConditionGroup projectId={projectId} fileId={fileId} selectedNodeAstPosition={selectedNodeAstPosition} /> */}
    </AsideSection>
  );
}
