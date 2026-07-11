import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createNumericLiteral } from "@ast/literal/create/createNumericLiteral";
import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import { describe, expect, it } from "vitest";
import { createBinaryExpression } from "./createBinaryExpression";

describe("createBinaryExpression", () => {
  it("should create binary expression with addition operator", () => {
    const left = createNumericLiteral(5);
    const right = createNumericLiteral(3);
    const expression = createBinaryExpression(left, "+", right, 0, 10);

    expect(expression.type).toBe("BinaryExpression");
    expect(expression.operator).toBe("+");
    expect(expression.left).toBe(left);
    expect(expression.right).toBe(right);
    expect(expression.span.start).toBe(0);
    expect(expression.span.end).toBeGreaterThanOrEqual(10);
    expect(expression.span.ctxt).toBe(0);
  });

  it("should create binary expression with subtraction operator", () => {
    const left = createIdentifier("x");
    const right = createNumericLiteral(1);
    const expression = createBinaryExpression(left, "-", right, 5, 15);

    expect(expression.operator).toBe("-");
    expect(expression.left).toBe(left);
    expect(expression.right).toBe(right);
    expect(expression.span.start).toBe(5);
  });

  it("should create binary expression with multiplication operator", () => {
    const left = createNumericLiteral(4);
    const right = createNumericLiteral(2);
    const expression = createBinaryExpression(left, "*", right, 0, 5);

    expect(expression.operator).toBe("*");
    expect(expression.left).toBe(left);
    expect(expression.right).toBe(right);
  });

  it("should create binary expression with division operator", () => {
    const left = createNumericLiteral(10);
    const right = createNumericLiteral(2);
    const expression = createBinaryExpression(left, "/", right, 0, 6);

    expect(expression.operator).toBe("/");
    expect(expression.left).toBe(left);
    expect(expression.right).toBe(right);
  });

  it("should create binary expression with comparison operators", () => {
    const left = createIdentifier("age");
    const right = createNumericLiteral(18);
    
    const gtExpression = createBinaryExpression(left, ">", right, 0, 10);
    expect(gtExpression.operator).toBe(">");
    
    const ltExpression = createBinaryExpression(left, "<", right, 0, 10);
    expect(ltExpression.operator).toBe("<");
    
    const eqExpression = createBinaryExpression(left, "===", right, 0, 12);
    expect(eqExpression.operator).toBe("===");
  });

  it("should create binary expression with logical operators", () => {
    const left = createIdentifier("isValid");
    const right = createIdentifier("isActive");
    
    const andExpression = createBinaryExpression(left, "&&", right, 0, 20);
    expect(andExpression.operator).toBe("&&");
    
    const orExpression = createBinaryExpression(left, "||", right, 0, 20);
    expect(orExpression.operator).toBe("||");
  });

  it("should create binary expression with string operands", () => {
    const left = createStringLiteral("Hello ");
    const right = createStringLiteral("World");
    const expression = createBinaryExpression(left, "+", right, 0, 15);

    expect(expression.operator).toBe("+");
    expect(expression.left).toBe(left);
    expect(expression.right).toBe(right);
  });

  it("should calculate span correctly based on operands", () => {
    const left = createIdentifier("variable");
    const right = createNumericLiteral(42);
    const expression = createBinaryExpression(left, "===", right, 10, 25);

    expect(expression.span.start).toBe(10);
    expect(expression.span.end).toBeGreaterThanOrEqual(25);
  });

  it("should handle modulo operator", () => {
    const left = createNumericLiteral(10);
    const right = createNumericLiteral(3);
    const expression = createBinaryExpression(left, "%", right, 0, 6);

    expect(expression.operator).toBe("%");
    expect(expression.left).toBe(left);
    expect(expression.right).toBe(right);
  });

  it("should handle inequality operators", () => {
    const left = createIdentifier("count");
    const right = createNumericLiteral(0);
    
    const neExpression = createBinaryExpression(left, "!==", right, 0, 12);
    expect(neExpression.operator).toBe("!==");
    
    const gteExpression = createBinaryExpression(left, ">=", right, 0, 10);
    expect(gteExpression.operator).toBe(">=");
    
    const lteExpression = createBinaryExpression(left, "<=", right, 0, 10);
    expect(lteExpression.operator).toBe("<=");
  });

  it("should handle bitwise operators", () => {
    const left = createNumericLiteral(5);
    const right = createNumericLiteral(3);
    
    const andExpression = createBinaryExpression(left, "&", right, 0, 5);
    expect(andExpression.operator).toBe("&");
    
    const orExpression = createBinaryExpression(left, "|", right, 0, 5);
    expect(orExpression.operator).toBe("|");
    
    const xorExpression = createBinaryExpression(left, "^", right, 0, 5);
    expect(xorExpression.operator).toBe("^");
  });

  it("should handle shift operators", () => {
    const left = createNumericLiteral(8);
    const right = createNumericLiteral(2);
    
    const leftShiftExpression = createBinaryExpression(left, "<<", right, 0, 6);
    expect(leftShiftExpression.operator).toBe("<<");
    
    const rightShiftExpression = createBinaryExpression(left, ">>", right, 0, 6);
    expect(rightShiftExpression.operator).toBe(">>");
  });
});