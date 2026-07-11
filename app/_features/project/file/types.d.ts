import type { FlatTreeNode, HierarchicalTreeNode } from "@editor/layer-tree";
import type { Properties } from "@project/ast-parser";
import type { FormattedParam } from "@project/ast-parser/types";
import type { Id } from "@convex/_generated/dataModel";
import type { Module } from "@swc/wasm-web";

export interface FileData {
  name: string;
  slug: string;
  extension: string;
  type: string;
  project_id?: Id<"projects"> | null;
  current_version?: number | null;
  current_version_id?: string | null;
  last_edit?: string | null;
  last_editor?: string | null;
  draft?: boolean | null;
  owner_id?: string | null;
  tags?: string[] | null;
}

export interface File extends FileData {
  id: Id<"files">;
  last_edit: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FileVersionData {
  version: number;
  file_id?: Id<"files"> | null;
  code?: string | null;
}

export interface FileVersion extends FileVersionData {
  id: string;
  created_at: string;
}

export interface FileWithAst extends FileWithVersion {
  ast?: Module | null;
  code?: {
    reference: string;
    augmented: string;
    stateless: string;
    preview: string;
  };
  path?: string;
  exportType?: "named" | "default" | "namespace" | "none";
  dependencies?: Array<{
    name: string;
    importedNames: string[];
    importType: "named" | "default" | "namespace" | "side-effect";
  }>;
  properties?: Properties;
  params?: Record<string, FormattedParam>;
  layerTree?: {
    hierarchical: HierarchicalTreeNode[];
    flat: Record<string, FlatTreeNode>;
  };
  spanMap?: Map<number, string>;
  previewVersionCode?: string;
}

export interface FileWithVersion extends File {
  current_version_content?: {
    code?: string | null;
  } | null;
}
