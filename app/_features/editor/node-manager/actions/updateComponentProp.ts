import { getSpan } from "@ast/core/get/getSpan";
import { updateJSXChildren } from "@ast/jsx";
import { isIdentifier } from "@ast/type-check";
import { createTransformedAST, manipulateFileAST } from "@ast/utils";
import type { JSXAttribute, JSXElement, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { findJSXElementById } from "../services/findNodeById";
import { createJSXAttributeWithValue } from "./createJSXAttributeWithValue";

export async function updateComponentProp(params: {
  projectId: string;
  fileId: string;
  nodeId: string;
  propName: string;
  propValue: string | number | boolean;
}): Promise<{ success: boolean; error?: string }> {
  const { projectId, fileId, nodeId, propName, propValue } = params;

  return manipulateFileAST(
    { projectId, fileId },
    (ast: Module) => {
      const transformedAst = createTransformedAST(ast);
      const element = findJSXElementById(transformedAst, nodeId, projectId, fileId);

      if (!element) {
        return null;
      }

      const elementSpanStart = getSpan(element).start;

      if (propName === "children") {
        const childrenValue = propValue === null || propValue === "" ? null : String(propValue);
        return updateJSXChildren(transformedAst, elementSpanStart, childrenValue);
      }

      // For other props, update as attribute
      let found = false;

      simple(transformedAst, {
        JSXElement(node) {
          if (found) return;

          const span = getSpan(node);
          if (span.start !== elementSpanStart) return;

          found = true;

          // Find existing attribute with this name
          const existingAttrIndex = node.opening.attributes.findIndex((attr) => {
            if (attr.type === "JSXAttribute") {
              const jsxAttr = attr as JSXAttribute;
              return isIdentifier(jsxAttr.name) && jsxAttr.name.value === propName;
            }
            return false;
          });

          const newAttr = createJSXAttributeWithValue(propName, propValue);

          if (existingAttrIndex >= 0) {
            // Update existing attribute
            node.opening.attributes[existingAttrIndex] = newAttr as unknown as (typeof node.opening.attributes)[0];
          } else {
            // Add new attribute
            node.opening.attributes.push(newAttr as unknown as (typeof node.opening.attributes)[0]);
          }
        },
      });

      return found ? transformedAst : null;
    },
    {
      nullErrorMessage: `Could not find element with id ${nodeId}`,
    }
  );
}
