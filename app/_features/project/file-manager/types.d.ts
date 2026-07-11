import type { Id } from "@convex/_generated/dataModel";
import type { FlatTreeNode, HierarchicalTreeNode } from "@editor/layer-tree";
import type { Properties } from "@project/ast-parser";
import type { FormattedParam } from "@project/ast-parser/types";
import type { Module } from "@swc/wasm-web";
import type { UIMessage } from "ai";

export interface ChatHistory {
  threadId: string;
  title: string;
  messages: UIMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface FileManagerItem {
  id: Id<"files">;
  name: string;
  slug: string;
  lastEdit: string | null;
  parsedAt: number | null;
  projectId: Id<"projects">;
  path: string;
  extension: string;
  code: {
    reference: string;
    augmented: string;
    stateless: string;
    preview: string;
  };
  history: FileHistory;
  ast?: Module | null;
  export?: "named" | "default" | "namespace";
  properties?: Properties;
  params?: Record<string, FormattedParam>;
  layerTree: {
    hierarchical: HierarchicalTreeNode[];
    flat: Record<string, FlatTreeNode>;
  };
  spanMap: Map<number, string>;
  parentSpanMap: Map<number, number>;
  viewportWidth?: number;
  chatHistory?: ChatHistory[];
  activeThreadId?: string;
  classSuggestions?: Record<string, string[]>;
}
