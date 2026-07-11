import { useShallowEqual } from "@shared/memo";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import { useMemo } from "react";
import type { SemanticClassGroup } from "../types";
import { ClassItem } from "./ClassItem";

export function StaticClassGroup({
  category,
  tokens,
  projectId,
  fileId,
  selectedNodeAstPosition,
}: SemanticClassGroup & {
  projectId: string;
  fileId: string;
  selectedNodeAstPosition: number | null;
}) {
  const memoizedTokens = useShallowEqual(tokens);

  const classItems = useMemo(
    () =>
      memoizedTokens.map((token) => (
        <ClassItem
          key={token}
          token={token}
          projectId={projectId}
          fileId={fileId}
          selectedNodeAstPosition={selectedNodeAstPosition}
        />
      )),
    [memoizedTokens, projectId, fileId, selectedNodeAstPosition]
  );

  return (
    <AsideSection title={category !== "Uncategorized" ? category : undefined} contentGap="small">
      {classItems}
    </AsideSection>
  );
}
