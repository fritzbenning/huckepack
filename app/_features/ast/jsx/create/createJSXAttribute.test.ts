import { isStringLiteral } from "@ast/type-check";
import { describe, expect, it } from "vitest";
import { createJSXAttribute } from "./createJSXAttribute";

describe("createJSXAttribute", () => {
  it("should create a JSX attribute with correct structure", () => {
    const attribute = createJSXAttribute("className", "test-class");

    expect(attribute.type).toBe("JSXAttribute");
    expect(attribute.span).toBeDefined();
    expect(attribute.name.type).toBe("Identifier");
    expect((attribute.name as { value: string }).value).toBe("className");
    expect(attribute.value?.type).toBe("StringLiteral");
    expect(isStringLiteral(attribute.value) && attribute.value.value).toBe("test-class");
    expect(isStringLiteral(attribute.value) && attribute.value.raw).toBe('"test-class"');
  });

  it("should create attribute with empty value", () => {
    const attribute = createJSXAttribute("disabled", "");

    expect((attribute.name as { value: string }).value).toBe("disabled");
    expect(isStringLiteral(attribute.value) && attribute.value.value).toBe("");
    expect(isStringLiteral(attribute.value) && attribute.value.raw).toBe('""');
  });

  it("should create attribute with special characters in name", () => {
    const attribute = createJSXAttribute("data-test-id", "my-test");

    expect((attribute.name as { value: string }).value).toBe("data-test-id");
    expect(isStringLiteral(attribute.value) && attribute.value.value).toBe("my-test");
  });

  it("should create attribute with numeric-like value", () => {
    const attribute = createJSXAttribute("tabIndex", "0");

    expect((attribute.name as { value: string }).value).toBe("tabIndex");
    expect(isStringLiteral(attribute.value) && attribute.value.value).toBe("0");
    expect(isStringLiteral(attribute.value) && attribute.value.raw).toBe('"0"');
  });
});
