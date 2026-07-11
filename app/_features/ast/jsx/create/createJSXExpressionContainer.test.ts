import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createNumericLiteral } from "@ast/literal/create/createNumericLiteral";
import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import { isIdentifier, isNumericLiteral, isStringLiteral } from "@ast/type-check";
import { describe, expect, it } from "vitest";
import { createJSXExpressionContainer } from "./createJSXExpressionContainer";

describe("createJSXExpressionContainer", () => {
  it("should create expression container with identifier", () => {
    const identifier = createIdentifier("myVariable");
    const container = createJSXExpressionContainer(identifier);

    expect(container.type).toBe("JSXExpressionContainer");
    expect(container.span).toBeDefined();
    expect(container.expression).toBe(identifier);
    expect(container.expression.type).toBe("Identifier");
    expect((container.expression as { value: string }).value).toBe("myVariable");
  });

  it("should create expression container with string literal", () => {
    const stringLiteral = createStringLiteral("Hello World");
    const container = createJSXExpressionContainer(stringLiteral);

    expect(container.expression).toBe(stringLiteral);
    expect(container.expression.type).toBe("StringLiteral");
    if (isStringLiteral(container.expression)) {
      expect(container.expression.value).toBe("Hello World");
    }
  });

  it("should create expression container with numeric literal", () => {
    const numericLiteral = createNumericLiteral(42);
    const container = createJSXExpressionContainer(numericLiteral);

    expect(container.expression).toBe(numericLiteral);
    expect(container.expression.type).toBe("NumericLiteral");
    if (isNumericLiteral(container.expression)) {
      expect(container.expression.value).toBe(42);
    }
  });

  it("should preserve expression properties", () => {
    const identifier = createIdentifier("props", 3, true);
    const container = createJSXExpressionContainer(identifier);

    if (isIdentifier(container.expression)) {
      expect(container.expression.span.ctxt).toBe(3);
      expect(container.expression.optional).toBe(true);
    }
  });
});
