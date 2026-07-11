import { getNestedJSXElements } from "@ast/jsx";
import { extractParamsFromVariable } from "@ast/parameter/utils/extractParamsFromVariable";
import { isIdentifier, isJSXElement, isJSXFragment, isParenthesisExpression } from "@ast/type-check";
import {
  createComponentMap,
  createParentSpanMap,
  createSpanMap,
  type FlatTreeNode,
  flattenTree,
  getLayerTree,
  type HierarchicalTreeNode,
} from "@editor/layer-tree";
import type {
  ExportDeclaration,
  ExportDefaultDeclaration,
  ExportDefaultExpression,
  ExportNamedDeclaration,
  Identifier,
  ImportDeclaration,
  JSXElement,
  JSXFragment,
  Module,
  TsInterfaceDeclaration,
} from "@swc/wasm-web";
import { simple } from "swc-walk";
import type { ExportType, ExternalDependency, FormattedParam, Properties } from "../types";
import { getDependency } from "../utils/getDependency";
import { getParams } from "../utils/getParams";
import { getProperties } from "../utils/getProperties";

interface Result {
  dependencies: ExternalDependency[];
  fileDependencies: string[];
  exportType: ExportType;
  properties: Properties;
  params: Record<string, FormattedParam>;
  layerTree: {
    hierarchical: HierarchicalTreeNode[];
    flat: Record<string, FlatTreeNode>;
  };
  spanMap: Map<number, string>;
  parentSpanMap: Map<number, number>;
  componentMap: Map<number, boolean>;
  parseASTSteps: {
    astTraversal: number | null;
    imports: number | null;
    exports: number | null;
    properties: number | null;
    returnStatement: number | null;
  };
}

export function parseAST(
  ast: Module,
  fileName: string,
  code?: string,
  projectId?: string,
  fileId?: string,
  currentFilePath?: string
): Result {
  const dependencies: ExternalDependency[] = [];
  const fileDependencies: string[] = [];
  let exportType: ExportType = "none";
  let params: Record<string, FormattedParam> = {};
  let properties: Properties = {};

  const layerTree = {
    hierarchical: [] as HierarchicalTreeNode[],
    flat: {} as Record<number, FlatTreeNode>,
  };
  let spanMap = new Map<number, string>();
  let parentSpanMap = new Map<number, number>();
  let componentMap = new Map<number, boolean>();

  let importsTime = 0;
  let exportsTime = 0;
  let propertiesTime = 0;
  let returnStatementTime = 0;

  const astTraversalStart = performance.now();
  simple(ast, {
    // process imports
    ImportDeclaration(importDecl) {
      const importStart = performance.now();
      const dependency = getDependency(importDecl as ImportDeclaration);
      const source = (importDecl as ImportDeclaration).source.value;

      if (dependency) {
        dependencies.push(dependency);
      } else if (source.startsWith(".") || source.startsWith("/") || source.startsWith("@/")) {
        fileDependencies.push(source);
      }
      importsTime += performance.now() - importStart;
    },

    // process exports
    ExportDefaultDeclaration(node) {
      const exportStart = performance.now();
      exportType = "default";
      const exportNode = node as ExportDefaultDeclaration;

      if (exportNode.decl && isIdentifier(exportNode.decl)) {
        const identifier = exportNode.decl as Identifier;
        params = extractParamsFromVariable(ast, identifier.value);
      } else {
        params = getParams(node as ExportDefaultDeclaration, fileName);
      }
      exportsTime += performance.now() - exportStart;
    },

    ExportDefaultExpression(node) {
      const exportStart = performance.now();
      exportType = "default";
      const exportExpr = node as ExportDefaultExpression;

      if (exportExpr.expression && isIdentifier(exportExpr.expression)) {
        const identifier = exportExpr.expression as Identifier;
        params = extractParamsFromVariable(ast, identifier.value);
      }
      exportsTime += performance.now() - exportStart;
    },

    ExportNamedDeclaration(node) {
      const exportStart = performance.now();
      exportType = "named";
      params = getParams(node as ExportNamedDeclaration, fileName);
      exportsTime += performance.now() - exportStart;
    },

    ExportDeclaration(node) {
      const exportStart = performance.now();
      exportType = "named";
      params = getParams(node as ExportDeclaration, fileName);
      exportsTime += performance.now() - exportStart;
    },

    ExportAllDeclaration() {
      const exportStart = performance.now();
      exportType = "namespace";
      exportsTime += performance.now() - exportStart;
    },

    TsInterfaceDeclaration(interfaceDecl) {
      const propertiesStart = performance.now();
      properties = getProperties(interfaceDecl as TsInterfaceDeclaration);
      propertiesTime += performance.now() - propertiesStart;
    },

    ReturnStatement(returnNode) {
      if (!returnNode?.argument) return;

      const returnStart = performance.now();

      let rootExpression = returnNode.argument;

      // Unwrap ParenthesisExpression if present
      if (isParenthesisExpression(rootExpression)) {
        rootExpression = rootExpression.expression;
      }

      // Handle JSXFragment (when multiple elements are wrapped in <>...</>)
      if (isJSXFragment(rootExpression)) {
        const fragment = rootExpression as JSXFragment;
        // Collect all JSX elements from the fragment
        const rootElements: JSXElement[] = [];
        for (const child of fragment.children) {
          const jsxElements = getNestedJSXElements(child);
          rootElements.push(...jsxElements);
        }

        // Track sibling indices per tag name (div[0], div[1], span[0], etc.)
        const siblingIndices = new Map<string, number>();

        // Process each root element with correct sibling index
        for (const jsxElement of rootElements) {
          const tagName = (jsxElement.opening.name as { value: string }).value;
          const currentIndex = siblingIndices.get(tagName) || 0;
          siblingIndices.set(tagName, currentIndex + 1);

          const treeNode = getLayerTree(jsxElement, currentIndex, "", code, 0, ast, projectId, fileId, currentFilePath);
          layerTree.hierarchical.push(treeNode);
          const flatMap = flattenTree(treeNode);
          Object.assign(layerTree.flat, Object.fromEntries(flatMap));

          // Merge span maps
          const childSpanMap = createSpanMap(treeNode);
          for (const [spanStart, nodeId] of childSpanMap.entries()) {
            spanMap.set(spanStart, nodeId);
          }

          // Merge parent span maps
          const childParentSpanMap = createParentSpanMap(treeNode);
          for (const [childSpan, parentSpan] of childParentSpanMap.entries()) {
            parentSpanMap.set(childSpan, parentSpan);
          }

          // Merge component instance maps
          const childComponentMap = createComponentMap(treeNode);
          for (const [spanStart, isInstance] of childComponentMap.entries()) {
            componentMap.set(spanStart, isInstance);
          }
        }
      } else if (isJSXElement(rootExpression)) {
        // Handle single JSXElement (original behavior)
        const rootNode = rootExpression as JSXElement;
        const treeNode = getLayerTree(rootNode, 0, "", code, 0, ast, projectId, fileId, currentFilePath);

        layerTree.hierarchical.push(treeNode);
        // Convert Map to plain object for serialization
        const flatMap = flattenTree(treeNode);
        layerTree.flat = Object.fromEntries(flatMap);

        spanMap = createSpanMap(treeNode);
        parentSpanMap = createParentSpanMap(treeNode);
        componentMap = createComponentMap(treeNode);
      }

      returnStatementTime += performance.now() - returnStart;
    },
  });
  const astTraversalEnd = performance.now();
  const astTraversalTime = astTraversalEnd - astTraversalStart;

  return {
    dependencies,
    fileDependencies,
    exportType,
    properties,
    params,
    layerTree,
    spanMap,
    parentSpanMap,
    componentMap,
    parseASTSteps: {
      astTraversal: astTraversalTime > 0 ? astTraversalTime : null,
      imports: importsTime > 0 ? importsTime : null,
      exports: exportsTime > 0 ? exportsTime : null,
      properties: propertiesTime > 0 ? propertiesTime : null,
      returnStatement: returnStatementTime > 0 ? returnStatementTime : null,
    },
  };
}
