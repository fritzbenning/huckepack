import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visitParents } from "unist-util-visit-parents";

export const rehypeDesignToken: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const nodesToTransform: Array<{ node: Element; parent: Element | undefined }> = [];

    visitParents(tree, "element", (node: Element, ancestors) => {
      if (node.tagName === "designtoken" || node.tagName === "DesignToken") {
        const props = node.properties || {};

        const getPropValue = (key: string): string => {
          const value = props[key];
          if (Array.isArray(value)) {
            return value[0]?.toString() || "";
          }
          if (value === null || value === undefined) {
            return "";
          }
          return value.toString();
        };

        const name = getPropValue("name") || getPropValue("title");
        const value = getPropValue("value") || getPropValue("color");

        if (name && value) {
          const parent = ancestors[ancestors.length - 1] as Element | undefined;
          nodesToTransform.push({ node, parent });
        }
      }
    });

    nodesToTransform.forEach(({ node, parent }) => {
      const props = node.properties || {};
      const getPropValue = (key: string): string => {
        const value = props[key];
        if (Array.isArray(value)) {
          return value[0]?.toString() || "";
        }
        if (value === null || value === undefined) {
          return "";
        }
        return value.toString();
      };

      const name = getPropValue("name") || getPropValue("title");
      const value = getPropValue("value") || getPropValue("color");
      const type = getPropValue("type") || "color";

      node.tagName = "div";
      node.properties = {
        "data-designtoken": "true",
        "data-name": name,
        "data-title": name,
        "data-type": type,
        "data-value": value,
      };

      if (parent && parent.type === "element" && parent.tagName === "p") {
        const siblings = parent.children;
        const isOnlyChild = siblings.length === 1;
        const hasOnlyWhitespaceAndThisNode = siblings.every((child) => {
          if (child === node) return true;
          if (child.type === "text") {
            return !child.value.trim();
          }
          return false;
        });

        if (isOnlyChild || hasOnlyWhitespaceAndThisNode) {
          parent.tagName = "div";
          parent.properties = {};
        }
      }
    });
  };
};
