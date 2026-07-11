import type { FlatTreeNode } from "@editor/layer-tree";

export function computeHighlightRange(
  selectedNodeData: FlatTreeNode | null,
  currentCode: string
): { from: number; to: number } | null {
  if (!selectedNodeData?.code) {
    return null;
  }

  const codeSnippet = selectedNodeData.code.trim();
  if (!codeSnippet) {
    return null;
  }

  const index = currentCode.indexOf(codeSnippet);
  if (index === -1) {
    return null;
  }

  return { from: index, to: index + codeSnippet.length };
}
