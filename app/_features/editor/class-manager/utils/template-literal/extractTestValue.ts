import {
  isBinaryExpression,
  isBooleanLiteral,
  isIdentifier,
  isMemberExpression,
  isNumericLiteral,
  isStringLiteral,
  isUnaryExpression,
} from "@ast/type-check";
import type { Expression } from "@swc/wasm-web";
import type { ParsedTestValue } from "../../types";
import { extractProperty } from "./extractProperty";
import { extractTestValuePart } from "./extractTestValuePart";

export function extractTestValue(node: Expression): ParsedTestValue {
  if (isUnaryExpression(node)) {
    if (node.operator === "!") {
      const property = extractProperty(node.argument);
      return {
        value: property ? `!${property}` : "unknown",
        property,
        operator: "!",
        testValue: null,
      };
    }
  }

  // Handle BinaryExpression: property operator testValue
  if (isBinaryExpression(node)) {
    const property = extractProperty(node.left);
    const testValue = extractTestValuePart(node.right);
    const operator = node.operator;
    const raw = `${property} ${operator} ${testValue}`;

    return {
      value: raw,
      property,
      operator,
      testValue,
    };
  }

  // Handle Identifier: just a property name
  if (isIdentifier(node)) {
    return {
      value: node.value,
      property: node.value,
      operator: null,
      testValue: null,
    };
  }

  // Handle NumericLiteral: just a value
  if (isNumericLiteral(node)) {
    const value = String(node.value);
    return {
      value,
      property: null,
      operator: null,
      testValue: node.value,
    };
  }

  // Handle BooleanLiteral: just a value
  if (isBooleanLiteral(node)) {
    const value = String(node.value);
    return {
      value,
      property: null,
      operator: null,
      testValue: node.value,
    };
  }

  // Handle StringLiteral: just a value
  if (isStringLiteral(node)) {
    return {
      value: node.value,
      property: null,
      operator: null,
      testValue: node.value,
    };
  }

  // Handle MemberExpression: obj.property
  if (isMemberExpression(node)) {
    const obj = extractProperty(node.object);
    const prop = isIdentifier(node.property) ? node.property.value : "?";
    const value = obj ? `${obj}.${prop}` : null;
    return {
      value: value || "unknown",
      property: value,
      operator: null,
      testValue: null,
    };
  }

  // Fallback for unknown expressions
  return {
    value: "unknown",
    property: null,
    operator: null,
    testValue: null,
  };
}
