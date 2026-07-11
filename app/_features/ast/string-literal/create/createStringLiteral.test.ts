import { describe, expect, it } from "vitest";
import { createStringLiteral } from "./createStringLiteral";

describe("createStringLiteral", () => {
  it("should create string literal with simple text", () => {
    const literal = createStringLiteral("Hello World");

    expect(literal.type).toBe("StringLiteral");
    expect(literal.value).toBe("Hello World");
    expect(literal.raw).toBe('"Hello World"');
    expect(literal.span).toBeDefined();
    expect(literal.span.end - literal.span.start).toBe('"Hello World"'.length);
  });

  it("should create string literal with empty string", () => {
    const literal = createStringLiteral("");

    expect(literal.value).toBe("");
    expect(literal.raw).toBe('""');
    expect(literal.span.end - literal.span.start).toBe('""'.length);
  });

  it("should create string literal with special characters", () => {
    const literal = createStringLiteral("Hello & <World> 'Test'");

    expect(literal.value).toBe("Hello & <World> 'Test'");
    expect(literal.raw).toBe("\"Hello & <World> 'Test'\"");
  });

  it("should create string literal with double quotes in content", () => {
    const literal = createStringLiteral('Say "Hello"');

    expect(literal.value).toBe('Say "Hello"');
    expect(literal.raw).toBe('"Say "Hello""');
  });

  it("should create string literal with newlines", () => {
    const literal = createStringLiteral("Line 1\nLine 2");

    expect(literal.value).toBe("Line 1\nLine 2");
    expect(literal.raw).toBe('"Line 1\nLine 2"');
  });

  it("should create string literal with tabs", () => {
    const literal = createStringLiteral("Column1\tColumn2");

    expect(literal.value).toBe("Column1\tColumn2");
    expect(literal.raw).toBe('"Column1\tColumn2"');
  });

  it("should create string literal with unicode characters", () => {
    const literal = createStringLiteral("Hello 🌍 World 🚀");

    expect(literal.value).toBe("Hello 🌍 World 🚀");
    expect(literal.raw).toBe('"Hello 🌍 World 🚀"');
  });

  it("should create string literal with backslashes", () => {
    const literal = createStringLiteral("Path\\to\\file");

    expect(literal.value).toBe("Path\\to\\file");
    expect(literal.raw).toBe('"Path\\to\\file"');
  });

  it("should create string literal with mixed whitespace", () => {
    const literal = createStringLiteral("  \t\n  Mixed  \r\n  ");

    expect(literal.value).toBe("  \t\n  Mixed  \r\n  ");
    expect(literal.raw).toBe('"  \t\n  Mixed  \r\n  "');
  });

  it("should create string literal with numbers", () => {
    const literal = createStringLiteral("123.456");

    expect(literal.value).toBe("123.456");
    expect(literal.raw).toBe('"123.456"');
  });

  it("should create string literal with CSS class names", () => {
    const literal = createStringLiteral("flex items-center justify-between");

    expect(literal.value).toBe("flex items-center justify-between");
    expect(literal.raw).toBe('"flex items-center justify-between"');
  });

  it("should create string literal with URL", () => {
    const literal = createStringLiteral("https://example.com/path?param=value");

    expect(literal.value).toBe("https://example.com/path?param=value");
    expect(literal.raw).toBe('"https://example.com/path?param=value"');
  });
});
