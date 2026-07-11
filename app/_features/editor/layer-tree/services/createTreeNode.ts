import { analyzeClasses } from "@editor/class-manager";
import { isFirstCharUppercase } from "@shared/utils/format";
import type { Identifier, JSXElement, JSXOpeningElement, Module } from "@swc/wasm-web";
import { extractNodeCode } from "../utils/extractNodeCode";
import { getDomPathID } from "../utils/getDomPathID";
import { getTitle } from "../utils/getTitle";
import { getTitlePrefix } from "../utils/getTitlePrefix";

/**
 * Converts a character position to a line number (1-indexed)
 */
function charToLine(code: string, charPos: number): number {
  if (charPos < 0 || charPos > code.length) {
    return 1;
  }
  return code.slice(0, charPos).split("\n").length;
}

import type { ComponentInstance } from "../types";

export const createTreeNode = (
  node: JSXElement,
  siblingIndex: number = 0,
  parentId: string = "",
  depth = 0,
  code?: string,
  component?: ComponentInstance,
  ast?: Module
) => {
  const opening = node.opening as JSXOpeningElement;
  const id = getDomPathID(opening, siblingIndex, parentId);
  const attribute = (opening.name as Identifier)?.value || "";
  const isComponent = isFirstCharUppercase(attribute);

  const title = getTitle(attribute, isComponent);
  const classes = analyzeClasses(opening);
  const titlePrefix = getTitlePrefix(classes?.classTokens || []);

  const hidden = classes?.classTokens.includes("hidden") ?? false;
  const locked = classes?.classTokens.includes("select-none") ?? false;

  // Calculate line number from span position if code is provided
  const line = code ? charToLine(code, node.span.start) : undefined;

  // Extract code snippet from AST using the node's span positions
  const codeSnippet = extractNodeCode(node, ast);

  return {
    id,
    info: {
      title,
      titlePrefix,
      attribute,
      span: node.span,
      line,
      ...(codeSnippet && { code: codeSnippet }),
      classes,
      hidden,
      locked,
      isComponent,
      depth,
      ...(component && { component }),
    },
  };
};
