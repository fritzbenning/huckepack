import type { Id } from "@convex/_generated/dataModel";
import { useSelectedNode } from "@editor/canvas";
import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import { useFileManagerStore } from "@project/file-manager";
import { useEffect, useRef, useState } from "react";

export function useNodeClasses(projectId: Id<"projects">, fileId: Id<"files">, nodeId?: string | null) {
  const selectedNode = useSelectedNode(projectId, fileId);
  const targetNodeId = nodeId ?? selectedNode;
  const layerTree = useFileManagerStore((state) => state.files[fileId]?.layerTree, projectId);

  const [astPosition, setAstPosition] = useState<number | null>(null);
  const [classes, setClasses] = useState<StringLiteralClasses | TemplateLiteralClasses | null>(null);

  const prevValuesRef = useRef<{
    astPosition: number | null;
    classes: StringLiteralClasses | TemplateLiteralClasses | null;
    nodeId: string | null;
  }>({
    astPosition: null,
    classes: null,
    nodeId: null,
  });

  useEffect(() => {
    if (!targetNodeId) {
      setAstPosition(null);
      setClasses(null);
      prevValuesRef.current = { astPosition: null, classes: null, nodeId: null };
      return;
    }

    const nodeData = layerTree?.flat[targetNodeId];
    const nodeIdChanged = prevValuesRef.current.nodeId !== targetNodeId;

    if (nodeData) {
      const newAstPosition = nodeData.classes?.span?.start ?? null;
      const newClasses = nodeData.classes ?? null;

      setAstPosition(newAstPosition);
      setClasses(newClasses);
      prevValuesRef.current = { astPosition: newAstPosition, classes: newClasses, nodeId: targetNodeId };
      return;
    }

    if (!nodeIdChanged && prevValuesRef.current.nodeId) {
      return;
    }

    setAstPosition(null);
    setClasses(null);
    prevValuesRef.current = { ...prevValuesRef.current, nodeId: targetNodeId };
  }, [layerTree, targetNodeId]);

  return { astPosition, classes };
}
