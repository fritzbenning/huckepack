import type { Identifier, JSXAttribute, JSXOpeningElement, SpreadElement, StringLiteral } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { addDataInstanceAttribute } from "./addDataInstanceAttribute";
import { addDataInstanceNameAttribute } from "./addDataInstanceNameAttribute";
import { addDataNodeIdAttribute } from "./addDataNodeIdAttribute";
import { addPropsSpread } from "./addPropsSpread";
import { hasPropsSpread } from "./hasPropsSpread";

// Mocks
vi.mock("../create/createJSXAttribute", () => ({
  createJSXAttribute: vi.fn((name, value) => ({
    type: "JSXAttribute",
    name: { type: "Identifier", value: name },
    value: { type: "StringLiteral", value: value },
  })),
}));

vi.mock("@ast/core/create/createSpan", () => ({ createSpan: () => ({ start: 0, end: 0 }) }));
vi.mock("@ast/identifier/create/createIdentifier", () => ({
  createIdentifier: (v: string) => ({ type: "Identifier", value: v }),
}));

describe("JSX Attributes Utils", () => {
  describe("addDataNodeIdAttribute", () => {
    it("should add data-node-id if missing", () => {
      const opening = { attributes: [] } as unknown as JSXOpeningElement;
      addDataNodeIdAttribute(opening, "123");
      expect(opening.attributes).toHaveLength(1);
      const attr = opening.attributes[0] as JSXAttribute;
      expect((attr.name as Identifier).value).toBe("data-node-id");
      expect((attr.value as StringLiteral).value).toBe("123");
    });

    it("should update data-node-id if present", () => {
      const opening = {
        attributes: [
          {
            type: "JSXAttribute",
            name: { type: "Identifier", value: "data-node-id" },
            value: { type: "StringLiteral", value: "old" },
          },
        ],
      } as unknown as JSXOpeningElement;
      addDataNodeIdAttribute(opening, "new");
      expect(opening.attributes).toHaveLength(1);
      const attr = opening.attributes[0] as JSXAttribute;
      expect((attr.value as StringLiteral).value).toBe("new");
    });
  });

  describe("addDataInstanceAttribute", () => {
    it("should add data-instance if missing", () => {
      const opening = { attributes: [] } as unknown as JSXOpeningElement;
      addDataInstanceAttribute(opening);
      const attr = opening.attributes[0] as JSXAttribute;
      expect((attr.name as Identifier).value).toBe("data-instance");
      expect((attr.value as StringLiteral).value).toBe("true");
    });

    it("should update existing data-instance", () => {
      const opening = {
        attributes: [
          {
            type: "JSXAttribute",
            name: { type: "Identifier", value: "data-instance" },
            value: { type: "StringLiteral", value: "false" },
          },
        ],
      } as unknown as JSXOpeningElement;
      addDataInstanceAttribute(opening);
      const attr = opening.attributes[0] as JSXAttribute;
      expect((attr.value as StringLiteral).value).toBe("true");
    });
  });

  describe("addDataInstanceNameAttribute", () => {
    it("should add instance name if missing", () => {
      const opening = { attributes: [] } as unknown as JSXOpeningElement;
      addDataInstanceNameAttribute(opening, "MyComp");
      const attr = opening.attributes[0] as JSXAttribute;
      expect((attr.name as Identifier).value).toBe("data-instance-name");
      expect((attr.value as StringLiteral).value).toBe("MyComp");
    });

    it("should update instance name if present", () => {
      const opening = {
        attributes: [
          {
            type: "JSXAttribute",
            name: { type: "Identifier", value: "data-instance-name" },
            value: { type: "StringLiteral", value: "OldComp" },
          },
        ],
      } as unknown as JSXOpeningElement;
      addDataInstanceNameAttribute(opening, "NewComp");
      const attr = opening.attributes[0] as JSXAttribute;
      expect((attr.value as StringLiteral).value).toBe("NewComp");
    });
  });

  describe("hasPropsSpread", () => {
    it("should return true if props spread exists", () => {
      const opening = {
        attributes: [
          {
            type: "SpreadElement",
            arguments: { type: "Identifier", value: "props" },
          },
        ],
      } as unknown as JSXOpeningElement;
      expect(hasPropsSpread(opening)).toBe(true);
    });

    it("should return false if no spread", () => {
      const opening = { attributes: [] } as unknown as JSXOpeningElement;
      expect(hasPropsSpread(opening)).toBe(false);
    });

    it("should return false if spread is not props/rest", () => {
      const opening = {
        attributes: [
          {
            type: "SpreadElement",
            arguments: { type: "Identifier", value: "other" },
          },
        ],
      } as unknown as JSXOpeningElement;
      expect(hasPropsSpread(opening)).toBe(false);
    });
  });

  describe("addPropsSpread", () => {
    it("should add props spread if missing", () => {
      const opening = { attributes: [] } as unknown as JSXOpeningElement;
      addPropsSpread(opening);
      expect(opening.attributes).toHaveLength(1);
      const attr = opening.attributes[0] as SpreadElement;
      expect(attr.type).toBe("SpreadElement");
      expect((attr.arguments as Identifier).value).toBe("props");
    });

    it("should not add if already present", () => {
      const opening = {
        attributes: [
          {
            type: "SpreadElement",
            arguments: { type: "Identifier", value: "props" },
          },
        ],
      } as unknown as JSXOpeningElement;
      addPropsSpread(opening);
      expect(opening.attributes).toHaveLength(1);
    });
  });
});
