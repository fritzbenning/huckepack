import { describe, expect, it } from "vitest";
import { createJSXText } from "./createJSXText";

describe("createJSXText", () => {
  it("should create JSX text with simple string", () => {
    const text = createJSXText("Hello World");

    expect(text.type).toBe("JSXText");
    expect(text.span).toBeDefined();
    expect(text.value).toBe("Hello World");
    expect(text.raw).toBe("Hello World");
  });

  it("should create JSX text with empty string", () => {
    const text = createJSXText("");

    expect(text.value).toBe("");
    expect(text.raw).toBe("");
  });

  it("should create JSX text with whitespace", () => {
    const text = createJSXText("   \n  \t  ");

    expect(text.value).toBe("   \n  \t  ");
    expect(text.raw).toBe("   \n  \t  ");
  });

  it("should create JSX text with special characters", () => {
    const text = createJSXText('Hello & <World> "Test"');

    expect(text.value).toBe('Hello & <World> "Test"');
    expect(text.raw).toBe('Hello & <World> "Test"');
  });

  it("should create JSX text with newlines", () => {
    const text = createJSXText("Line 1\nLine 2\nLine 3");

    expect(text.value).toBe("Line 1\nLine 2\nLine 3");
    expect(text.raw).toBe("Line 1\nLine 2\nLine 3");
  });

  it("should create JSX text with unicode characters", () => {
    const text = createJSXText("Hello 🌍 World 🚀");

    expect(text.value).toBe("Hello 🌍 World 🚀");
    expect(text.raw).toBe("Hello 🌍 World 🚀");
  });

  it("should preserve exact input", () => {
    const input = "  Mixed   spacing\t\nand\r\nline breaks  ";
    const text = createJSXText(input);

    expect(text.value).toBe(input);
    expect(text.raw).toBe(input);
  });
});
