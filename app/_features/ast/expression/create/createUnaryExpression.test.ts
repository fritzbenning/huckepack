import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createBooleanLiteral } from "@ast/literal/create/createBooleanLiteral";
import { createNumericLiteral } from "@ast/literal/create/createNumericLiteral";
import type { NumericLiteral } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { createUnaryExpression } from "./createUnaryExpression";

describe("createUnaryExpression", () => {
  it("should create unary expression with logical NOT operator", () => {
    const argument = createBooleanLiteral(true);
    const expression = createUnaryExpression(argument, "!", 0, 5);

    expect(expression.type).toBe("UnaryExpression");
    expect(expression.operator).toBe("!");
    expect(expression.argument).toBe(argument);
    expect(expression.span.start).toBe(0);
    expect(expression.span.end).toBeGreaterThanOrEqual(5);
    expect(expression.span.ctxt).toBe(0);
  });

  it("should create unary expression with negation operator", () => {
    const argument = createNumericLiteral(42);
    const expression = createUnaryExpression(argument, "-", 0, 5);

    expect(expression.operator).toBe("-");
    expect(expression.argument).toBe(argument);
  });

  it("should create unary expression with positive operator", () => {
    const argument = createNumericLiteral(42);
    const expression = createUnaryExpression(argument, "+", 0, 5);

    expect(expression.operator).toBe("+");
    expect(expression.argument).toBe(argument);
  });

  it("should create unary expression with bitwise NOT operator", () => {
    const argument = createNumericLiteral(5);
    const expression = createUnaryExpression(argument, "~", 0, 5);

    expect(expression.operator).toBe("~");
    expect(expression.argument).toBe(argument);
  });

  it("should create unary expression with typeof operator", () => {
    const argument = createIdentifier("variable");
    const expression = createUnaryExpression(argument, "typeof", 0, 15);

    expect(expression.operator).toBe("typeof");
    expect(expression.argument).toBe(argument);
  });

  it("should create unary expression with void operator", () => {
    const argument = createNumericLiteral(0);
    const expression = createUnaryExpression(argument, "void", 0, 10);

    expect(expression.operator).toBe("void");
    expect(expression.argument).toBe(argument);
  });

  it("should create unary expression with delete operator", () => {
    const argument = createIdentifier("obj.prop");
    const expression = createUnaryExpression(argument, "delete", 0, 15);

    expect(expression.operator).toBe("delete");
    expect(expression.argument).toBe(argument);
  });

  it("should calculate span correctly for single character operators", () => {
    const argument = createIdentifier("x");
    const expression = createUnaryExpression(argument, "!", 5, 10);

    expect(expression.span.start).toBe(5);
    expect(expression.span.end).toBeGreaterThanOrEqual(10);
  });

  it("should calculate span correctly for multi-character operators", () => {
    const argument = createIdentifier("variable");
    const expression = createUnaryExpression(argument, "typeof", 0, 20);

    expect(expression.span.start).toBe(0);
    expect(expression.span.end).toBeGreaterThanOrEqual(20);
  });

  it("should handle NOT operator with identifier", () => {
    const argument = createIdentifier("isValid");
    const expression = createUnaryExpression(argument, "!", 0, 10);

    expect(expression.operator).toBe("!");
    expect(expression.argument).toBe(argument);
    expect(expression.type).toBe("UnaryExpression");
  });

  it("should handle negation with complex identifier", () => {
    const argument = createIdentifier("obj.value");
    const expression = createUnaryExpression(argument, "-", 0, 12);

    expect(expression.operator).toBe("-");
    expect(expression.argument).toBe(argument);
  });

  it("should preserve argument properties", () => {
    const argument = createNumericLiteral(123);
    const expression = createUnaryExpression(argument, "+", 0, 8);

    expect(expression.argument).toBe(argument);
    expect((expression.argument as NumericLiteral).value).toBe(123);
    expect((expression.argument as NumericLiteral).type).toBe("NumericLiteral");
  });

  it("should handle void with zero", () => {
    const argument = createNumericLiteral(0);
    const expression = createUnaryExpression(argument, "void", 0, 7);

    expect(expression.operator).toBe("void");
    expect(expression.argument).toBe(argument);
  });

  it("should handle typeof with string identifier", () => {
    const argument = createIdentifier("myVariable");
    const expression = createUnaryExpression(argument, "typeof", 0, 16);

    expect(expression.operator).toBe("typeof");
    expect(expression.argument).toBe(argument);
  });
});
