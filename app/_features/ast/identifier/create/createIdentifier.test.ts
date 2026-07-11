import { describe, expect, it } from "vitest";
import { createIdentifier } from "./createIdentifier";

describe("createIdentifier", () => {
  it("should create identifier with default parameters", () => {
    const identifier = createIdentifier("myVariable");

    expect(identifier.type).toBe("Identifier");
    expect(identifier.value).toBe("myVariable");
    expect(identifier.ctxt).toBe(0);
    expect(identifier.optional).toBe(false);
    expect(identifier.span).toBeDefined();
    expect(identifier.span.end - identifier.span.start).toBe("myVariable".length);
    // Span has ctxt: 0 (required by SWC Span type), Identifier has ctxt at top level
    expect(identifier.span.ctxt).toBe(0);
    expect(identifier.ctxt).toBe(0);
  });

  it("should create identifier with custom context", () => {
    const identifier = createIdentifier("myVariable", 2);

    expect(identifier.value).toBe("myVariable");
    expect(identifier.ctxt).toBe(2);
    expect(identifier.optional).toBe(false);
    // Span has ctxt: 0 (required by SWC Span type), Identifier has ctxt at top level
    expect(identifier.span.ctxt).toBe(0);
  });

  it("should create optional identifier", () => {
    const identifier = createIdentifier("optionalProp", 0, true);

    expect(identifier.value).toBe("optionalProp");
    expect(identifier.ctxt).toBe(0);
    expect(identifier.optional).toBe(true);
  });

  it("should create identifier with all custom parameters", () => {
    const identifier = createIdentifier("customVar", 3, true);

    expect(identifier.value).toBe("customVar");
    expect(identifier.ctxt).toBe(3);
    expect(identifier.optional).toBe(true);
  });

  it("should handle empty string identifier", () => {
    const identifier = createIdentifier("");

    expect(identifier.value).toBe("");
    expect(identifier.span.end - identifier.span.start).toBe(0);
  });

  it("should handle single character identifier", () => {
    const identifier = createIdentifier("x");

    expect(identifier.value).toBe("x");
    expect(identifier.span.end - identifier.span.start).toBe(1);
  });

  it("should handle long identifier names", () => {
    const longName = "veryLongVariableNameThatExceedsNormalLength";
    const identifier = createIdentifier(longName);

    expect(identifier.value).toBe(longName);
    expect(identifier.span.end - identifier.span.start).toBe(longName.length);
  });

  it("should handle identifiers with numbers and underscores", () => {
    const identifier = createIdentifier("var_123_test");

    expect(identifier.value).toBe("var_123_test");
    expect(identifier.ctxt).toBe(0);
    expect(identifier.optional).toBe(false);
  });

  it("should handle camelCase identifiers", () => {
    const identifier = createIdentifier("camelCaseVariable");

    expect(identifier.value).toBe("camelCaseVariable");
    expect(identifier.span.end - identifier.span.start).toBe("camelCaseVariable".length);
  });

  it("should handle PascalCase identifiers", () => {
    const identifier = createIdentifier("PascalCaseComponent");

    expect(identifier.value).toBe("PascalCaseComponent");
    expect(identifier.span.end - identifier.span.start).toBe("PascalCaseComponent".length);
  });
});
