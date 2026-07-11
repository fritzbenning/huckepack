import type { Id } from "@convex/_generated/dataModel";
import { useSelectedNode } from "@editor/canvas";
import type { DesignPropertyKey } from "@editor/design/registry";
import { getPresentDesignProperties } from "@editor/design/shared/utils/registry/getPresentDesignProperties";
import { useFileManagerStore } from "@project/file-manager";
import { useMemo } from "react";

export function usePresentDesignRules(
  projectId: Id<"projects">,
  fileId: Id<"files">,
  nodeId?: string | null
): Record<DesignPropertyKey, boolean> {
  const selectedNode = useSelectedNode(projectId, fileId);
  const targetNodeId = nodeId ?? selectedNode;
  const layerTree = useFileManagerStore((state) => state.files[fileId]?.layerTree, projectId);

  const propertiesCache = useMemo(() => {
    if (!layerTree?.flat) {
      return new Map<string, Record<DesignPropertyKey, boolean>>();
    }

    const cache = new Map<string, Record<DesignPropertyKey, boolean>>();

    for (const [id, nodeData] of Object.entries(layerTree.flat)) {
      const classTokens = nodeData.classes?.classTokens ?? [];
      cache.set(id, getPresentDesignProperties(classTokens));
    }

    return cache;
  }, [layerTree]);

  return useMemo(() => {
    if (!targetNodeId) {
      return getPresentDesignProperties([]);
    }
    return propertiesCache.get(targetNodeId) ?? getPresentDesignProperties([]);
  }, [targetNodeId, propertiesCache]);
}
