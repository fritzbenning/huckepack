import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createLiteral } from "@ast/literal/create/createLiteral";
import { isExportDeclaration } from "@ast/type-check";
import { createTsType } from "@ast/types/create/createTsType";
import type { LiteralType } from "@ast/types/literal";
import { createTransformedAST } from "@ast/utils";
import type {
  AssignmentPatternProperty,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  Module,
  ObjectPattern,
} from "@swc/wasm-web";
import { simple } from "swc-walk";
import { ensureRestParameter } from "../ensure/ensureRestParameter";

export function addParameter(
  ast: Module,
  _fileName: string,
  paramName: string,
  _paramType: string,
  defaultValue?: string | number | boolean
): Module | null {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    ExportDefaultDeclaration(node: unknown, _state?: unknown) {
      if (found) {
        return;
      }
      const exportNode = node as { decl: FunctionDeclaration | FunctionExpression };
      const declaration = exportNode.decl as FunctionDeclaration | FunctionExpression;
      const identifier = declaration.identifier as Identifier;

      // Ensure rest parameter exists before adding the new parameter
      // This ensures both operations happen in the same AST manipulation
      ensureRestParameter(declaration, "restProps");

      // Process the first exported function we find (since we're working on a specific file AST)
      let pattern = declaration.params[0]?.pat as ObjectPattern | undefined;

      // Create parameter pattern if it doesn't exist
      if (!pattern || pattern.type !== "ObjectPattern") {
        // Get function name to create interface type name
        const functionName = identifier.value;
        const interfaceName = `${functionName}Props`;

        // Create the ObjectPattern with type annotation
        pattern = {
          type: "ObjectPattern",
          span: createSpan(0),
          properties: [],
          optional: false,
          typeAnnotation: {
            type: "TsTypeAnnotation",
            span: createSpan(interfaceName.length),
            typeAnnotation: createTsType(interfaceName),
          },
        } as ObjectPattern;

        // Create a Parameter wrapper
        const newParameter = {
          type: "Parameter" as const,
          span: createSpan(0),
          decorators: [],
          pat: pattern,
        };

        // Add the parameter to the function
        if (!declaration.params) {
          declaration.params = [];
        }
        declaration.params[0] = newParameter;
      }

      if (!pattern.properties) {
        pattern.properties = [];
      }

      const properties = pattern.properties;

      // Check if parameter already exists
      // Skip RestElement items (like ...restProps) which don't have a key property
      if (
        properties.some((p) => {
          if (p.type === "RestElement" || !("key" in p) || !p.key) {
            return false;
          }
          const assignmentParam = p as AssignmentPatternProperty;
          return assignmentParam.key && "value" in assignmentParam.key && assignmentParam.key.value === paramName;
        })
      ) {
        found = true;
        return;
      }

      // Create new parameter
      const literalType: LiteralType | null =
        defaultValue !== undefined
          ? typeof defaultValue === "string"
            ? "StringLiteral"
            : typeof defaultValue === "number"
              ? "NumericLiteral"
              : "BooleanLiteral"
          : null;

      const newParam: AssignmentPatternProperty = {
        type: "AssignmentPatternProperty",
        key: createIdentifier(paramName, 3),
        value: literalType ? createLiteral(defaultValue as string | number | boolean, literalType) : undefined,
        span: createSpan(paramName.length),
      };

      // Find the index of the RestElement (if any) to insert before it
      // Rest elements must be the last element in destructuring patterns
      const restElementIndex = properties.findIndex((p) => p.type === "RestElement");

      if (restElementIndex !== -1) {
        properties.splice(restElementIndex, 0, newParam as unknown as (typeof properties)[0]);
      } else {
        properties.push(newParam as unknown as (typeof properties)[0]);
      }
      found = true;
    },

    ExportNamedDeclaration(node: unknown, _state?: unknown) {
      if (found) {
        return;
      }
      const exportNode = node as { declaration?: FunctionDeclaration };
      const declaration = exportNode.declaration as FunctionDeclaration | undefined;
      if (!declaration) {
        return;
      }

      const identifier = declaration.identifier as Identifier;

      // Ensure rest parameter exists before adding the new parameter
      // This ensures both operations happen in the same AST manipulation, avoiding double operations
      ensureRestParameter(declaration, "restProps");
      // Process the first exported function we find (since we're working on a specific file AST)
      let pattern = declaration.params[0]?.pat as ObjectPattern | undefined;

      // Create parameter pattern if it doesn't exist
      if (!pattern || pattern.type !== "ObjectPattern") {
        // Get function name to create interface type name
        const functionName = identifier.value;
        const interfaceName = `${functionName}Props`;

        // Create the ObjectPattern with type annotation
        pattern = {
          type: "ObjectPattern",
          span: createSpan(0),
          properties: [],
          optional: false,
          typeAnnotation: {
            type: "TsTypeAnnotation",
            span: createSpan(interfaceName.length),
            typeAnnotation: createTsType(interfaceName),
          },
        } as ObjectPattern;

        // Create a Parameter wrapper
        const newParameter = {
          type: "Parameter" as const,
          span: createSpan(0),
          decorators: [],
          pat: pattern,
        };

        // Add the parameter to the function
        if (!declaration.params) {
          declaration.params = [];
        }
        declaration.params[0] = newParameter;
      }

      if (!pattern.properties) {
        pattern.properties = [];
      }

      const properties = pattern.properties;

      // Check if parameter already exists
      // Skip RestElement items (like ...restProps) which don't have a key property
      if (
        properties.some((p) => {
          if (p.type === "RestElement" || !("key" in p) || !p.key) {
            return false;
          }
          const assignmentParam = p as AssignmentPatternProperty;
          return assignmentParam.key && "value" in assignmentParam.key && assignmentParam.key.value === paramName;
        })
      ) {
        found = true;
        return;
      }

      const literalType: LiteralType | null =
        defaultValue !== undefined
          ? typeof defaultValue === "string"
            ? "StringLiteral"
            : typeof defaultValue === "number"
              ? "NumericLiteral"
              : "BooleanLiteral"
          : null;

      const newParam: AssignmentPatternProperty = {
        type: "AssignmentPatternProperty",
        key: createIdentifier(paramName, 3),
        value: literalType ? createLiteral(defaultValue as string | number | boolean, literalType) : undefined,
        span: createSpan(paramName.length),
      };

      // Find the index of the RestElement (if any) to insert before it
      // Rest elements must be the last element in destructuring patterns
      const restElementIndex = properties.findIndex((p) => p.type === "RestElement");

      if (restElementIndex !== -1) {
        properties.splice(restElementIndex, 0, newParam as unknown as (typeof properties)[0]);
      } else {
        properties.push(newParam as unknown as (typeof properties)[0]);
      }
      found = true;
    },

    ExportDeclaration(node: unknown, _state?: unknown) {
      if (found) {
        return;
      }
      if (!isExportDeclaration(node)) {
        return;
      }

      const exportNode = node as { declaration: FunctionDeclaration };
      const declaration = exportNode.declaration as FunctionDeclaration;
      const identifier = declaration.identifier as Identifier;

      // Ensure rest parameter exists before adding the new parameter
      // This ensures both operations happen in the same AST manipulation, avoiding double operations
      ensureRestParameter(declaration, "restProps");

      // Process the first exported function we find (since we're working on a specific file AST)
      let pattern = declaration.params[0]?.pat as ObjectPattern | undefined;

      // Create parameter pattern if it doesn't exist
      if (!pattern || pattern.type !== "ObjectPattern") {
        // Get function name to create interface type name
        const functionName = identifier.value;
        const interfaceName = `${functionName}Props`;

        // Create the ObjectPattern with type annotation
        pattern = {
          type: "ObjectPattern",
          span: createSpan(0),
          properties: [],
          optional: false,
          typeAnnotation: {
            type: "TsTypeAnnotation",
            span: createSpan(interfaceName.length),
            typeAnnotation: createTsType(interfaceName),
          },
        } as ObjectPattern;

        // Create a Parameter wrapper
        const newParameter = {
          type: "Parameter" as const,
          span: createSpan(0),
          decorators: [],
          pat: pattern,
        };

        // Add the parameter to the function
        if (!declaration.params) {
          declaration.params = [];
        }
        declaration.params[0] = newParameter;
      }

      if (!pattern.properties) {
        pattern.properties = [];
      }

      const properties = pattern.properties;

      // Check if parameter already exists
      // Skip RestElement items (like ...restProps) which don't have a key property
      if (
        properties.some((p) => {
          if (p.type === "RestElement" || !("key" in p) || !p.key) {
            return false;
          }
          const assignmentParam = p as AssignmentPatternProperty;
          return assignmentParam.key && "value" in assignmentParam.key && assignmentParam.key.value === paramName;
        })
      ) {
        found = true;
        return;
      }

      const literalType: LiteralType | null =
        defaultValue !== undefined
          ? typeof defaultValue === "string"
            ? "StringLiteral"
            : typeof defaultValue === "number"
              ? "NumericLiteral"
              : "BooleanLiteral"
          : null;

      const newParam: AssignmentPatternProperty = {
        type: "AssignmentPatternProperty",
        key: createIdentifier(paramName, 3),
        value: literalType ? createLiteral(defaultValue as string | number | boolean, literalType) : undefined,
        span: createSpan(paramName.length),
      };

      // Find the index of the RestElement (if any) to insert before it
      // Rest elements must be the last element in destructuring patterns
      const restElementIndex = properties.findIndex((p) => p.type === "RestElement");

      if (restElementIndex !== -1) {
        properties.splice(restElementIndex, 0, newParam as unknown as (typeof properties)[0]);
      } else {
        properties.push(newParam as unknown as (typeof properties)[0]);
      }
      found = true;
    },
  });

  return found ? transformedAst : null;
}
