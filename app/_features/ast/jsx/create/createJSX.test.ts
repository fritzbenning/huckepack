import type { Identifier, JSXText, StringLiteral } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { createJSXAttribute } from "./createJSXAttribute";
import { createJSXElement } from "./createJSXElement";
import { createJSXExpressionContainer } from "./createJSXExpressionContainer";
import { createJSXFragment } from "./createJSXFragment";
import { createJSXText } from "./createJSXText";

// Mock dependencies
vi.mock("@ast/core/create/createSpan", () => ({
  createSpan: vi.fn(() => ({ start: 0, end: 0, ctxt: 0 })),
}));

vi.mock("@ast/identifier/create/createIdentifier", () => ({
  createIdentifier: vi.fn((value: string) => ({ type: "Identifier", value })),
}));

vi.mock("@ast/string-literal/create/createStringLiteral", () => ({
  createStringLiteral: vi.fn((value: string) => ({ type: "StringLiteral", value })),
}));

describe("JSX Creation Utils", () => {
  describe("createJSXElement", () => {
    it("should create a JSX element with empty attributes", () => {
      const result = createJSXElement("div");
      expect(result.type).toBe("JSXElement");
      expect((result.opening.name as Identifier).value).toBe("div");
      expect(result.opening.attributes).toHaveLength(0);
      expect((result.closing?.name as Identifier).value).toBe("div");
      expect(result.children).toHaveLength(0);
    });

    it("should create JSX element with children", () => {
      const child: JSXText = {
        type: "JSXText" as const,
        span: { start: 0, end: 5, ctxt: 0 },
        value: "Hello",
        raw: "Hello",
      };
      const result = createJSXElement("span", [child]);
      expect(result.children).toHaveLength(1);
      expect(result.children[0]).toBe(child);
    });
  });

  describe("createJSXAttribute", () => {
    it("should create attribute with string value", () => {
      const result = createJSXAttribute("id", "my-id");
      expect(result.type).toBe("JSXAttribute");
      expect((result.name as Identifier).value).toBe("id");
      expect((result.value as StringLiteral).type).toBe("StringLiteral");
      expect((result.value as StringLiteral).value).toBe("my-id");
    });
  });

  describe("createJSXExpressionContainer", () => {
    it("should create container with expression", () => {
      const expr: Identifier = {
        type: "Identifier" as const,
        value: "x",
        span: { start: 0, end: 1, ctxt: 0 },
        optional: false,
      };
      const result = createJSXExpressionContainer(expr);
      expect(result.type).toBe("JSXExpressionContainer");
      expect(result.expression).toBe(expr);
    });
  });

  describe("createJSXFragment", () => {
    it("should create fragment with children", () => {
      const child: JSXText = {
        type: "JSXText" as const,
        span: { start: 0, end: 3, ctxt: 0 },
        value: "foo",
        raw: "foo",
      };
      const result = createJSXFragment([child]);
      expect(result.type).toBe("JSXFragment");
      expect(result.children).toHaveLength(1);
      expect(result.children[0]).toBe(child);
      expect(result.opening.type).toBe("JSXOpeningFragment");
      expect(result.closing.type).toBe("JSXClosingFragment");
    });

    it("should create empty fragment", () => {
      const result = createJSXFragment();
      expect(result.children).toHaveLength(0);
    });
  });

  describe("createJSXText", () => {
    it("should create text node", () => {
      const result = createJSXText("some text");
      expect(result.type).toBe("JSXText");
      expect(result.value).toBe("some text");
      expect(result.raw).toBe("some text");
    });
  });
});
