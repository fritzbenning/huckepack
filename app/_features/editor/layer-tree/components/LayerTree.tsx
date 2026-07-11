import type { Id } from "@convex/_generated/dataModel";
import type { HierarchicalTreeNode } from "@editor/layer-tree";
import { useFileManagerStore } from "@project/file-manager";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import { useEffect, useState } from "react";
import { TreeGroup } from "./TreeGroup";

export function LayerTree({ projectId, fileId }: { projectId: Id<"projects">; fileId: Id<"files"> }) {
  const layerTree = useFileManagerStore(
    (state) => (fileId ? state.files[fileId]?.layerTree.hierarchical : []),
    projectId
  );

  const [sortableTree, setSortableTree] = useState<HierarchicalTreeNode[]>(layerTree);

  useEffect(() => {
    setSortableTree(layerTree);
  }, [layerTree]);

  return (
    <AsideSection
      contentGap="tiny"
      indentedContent={false}
      divider={false}
      titleGap={false}
      className="overflow-y-auto pt-2"
    >
      {sortableTree.map((node) => (
        <TreeGroup key={node.id} node={node} projectId={projectId} fileId={fileId} />
      ))}
    </AsideSection>
  );
}
