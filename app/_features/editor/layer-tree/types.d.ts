import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { PropertyType } from "@project/ast-parser";
import type { Span } from "@swc/wasm-web";

export type ComponentProp = {
  type: PropertyType;
  optional: boolean;
  defaultValue: string | number | boolean | null;
  currentValue: string | number | boolean | null; // Actual value passed to this instance
};

export type ComponentInstance = {
  fileId: string;
  fileName: string;
  props: Record<string, ComponentProp>; // Consolidated prop information: type, default, and current value
};

export type TreeNodeInfo = {
  title: string;
  titlePrefix: string;
  attribute: string;
  span: Span;
  line?: number; // Line number (1-indexed) calculated from span.start
  code?: string; // Code snippet extracted from AST span positions
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  hidden: boolean;
  locked: boolean;
  isComponent: boolean;
  depth: number;
  component?: ComponentInstance; // Component instance info if this node is a component
};

export type HierarchicalTreeNode = {
  id: string;
  info: TreeNodeInfo;
  children: HierarchicalTreeNode[];
};

export type FlatTreeNode = TreeNodeInfo;
