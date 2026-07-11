import { isStringLiteral } from "@ast/type-check";
import type { Identifier, JSXAttribute, JSXOpeningElement, SpreadElement } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { addDataNodeIdAttribute } from "./addDataNodeIdAttribute";

describe("addDataNodeIdAttribute", () => {
  it("should add data-node-id attribute when it doesn't exist", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    addDataNodeIdAttribute(mockOpening, "test-node-id");

    expect(mockOpening.attributes).toHaveLength(1);
    const attr = mockOpening.attributes[0] as JSXAttribute;
    expect(attr.type).toBe("JSXAttribute");
    expect((attr.name as Identifier).value).toBe("data-node-id");
    if (attr.value && isStringLiteral(attr.value)) {
      expect(attr.value.value).toBe("test-node-id");
      expect(attr.value.raw).toBe('"test-node-id"');
    }
  });

  it("should update existing data-node-id attribute", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 30, ctxt: 0 },
          name: { type: "Identifier", value: "data-node-id", span: { start: 5, end: 17, ctxt: 0 } } as Identifier,
          value: { type: "StringLiteral", value: "old-id", raw: '"old-id"', span: { start: 18, end: 26, ctxt: 0 } },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    addDataNodeIdAttribute(mockOpening, "new-node-id");

    expect(mockOpening.attributes).toHaveLength(1); // Should not add new attribute
    const attr = mockOpening.attributes[0] as JSXAttribute;
    expect((attr.name as Identifier).value).toBe("data-node-id");
    if (attr.value && isStringLiteral(attr.value)) {
      expect(attr.value.value).toBe("new-node-id");
      expect(attr.value.raw).toBe('"new-node-id"');
    }
  });

  it("should add data-node-id attribute alongside existing attributes", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 25, ctxt: 0 },
          name: { type: "Identifier", value: "className", span: { start: 5, end: 14, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "test-class",
            raw: '"test-class"',
            span: { start: 15, end: 25, ctxt: 0 },
          },
        } as JSXAttribute,
        {
          type: "JSXAttribute",
          span: { start: 26, end: 35, ctxt: 0 },
          name: { type: "Identifier", value: "id", span: { start: 26, end: 28, ctxt: 0 } } as Identifier,
          value: { type: "StringLiteral", value: "test-id", raw: '"test-id"', span: { start: 29, end: 35, ctxt: 0 } },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    addDataNodeIdAttribute(mockOpening, "my-node-id");

    expect(mockOpening.attributes).toHaveLength(3);

    // Check existing attributes are preserved
    expect(((mockOpening.attributes[0] as JSXAttribute).name as Identifier).value).toBe("className");
    expect(((mockOpening.attributes[1] as JSXAttribute).name as Identifier).value).toBe("id");

    // Check new attribute is added
    const newAttr = mockOpening.attributes[2] as JSXAttribute;
    expect((newAttr.name as Identifier).value).toBe("data-node-id");
    if (newAttr.value && isStringLiteral(newAttr.value)) {
      expect(newAttr.value.value).toBe("my-node-id");
    }
  });

  it("should handle empty node id", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    addDataNodeIdAttribute(mockOpening, "");

    expect(mockOpening.attributes).toHaveLength(1);
    const attr = mockOpening.attributes[0] as JSXAttribute;
    if (attr.value && isStringLiteral(attr.value)) {
      expect(attr.value.value).toBe("");
      expect(attr.value.raw).toBe('""');
    }
  });

  it("should handle special characters in node id", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    addDataNodeIdAttribute(mockOpening, "node-123_test@special");

    expect(mockOpening.attributes).toHaveLength(1);
    const attr = mockOpening.attributes[0] as JSXAttribute;
    if (attr.value && isStringLiteral(attr.value)) {
      expect(attr.value.value).toBe("node-123_test@special");
    }
  });

  it("should not affect non-JSXAttribute elements", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "SpreadElement",
          span: { start: 5, end: 15, ctxt: 0 },
          spread: { start: 5, end: 8, ctxt: 0 },
          arguments: {
            type: "Identifier",
            value: "props",
            span: { start: 8, end: 13, ctxt: 0 },
            ctxt: 0,
            optional: false,
          },
        } as SpreadElement,
      ],
      selfClosing: false,
    };

    addDataNodeIdAttribute(mockOpening, "test-id");

    expect(mockOpening.attributes).toHaveLength(2);
    expect(mockOpening.attributes[0].type).toBe("SpreadElement"); // Preserved
    expect((mockOpening.attributes[1] as JSXAttribute).type).toBe("JSXAttribute"); // Added
  });

  it("should update data-node-id when mixed with other attributes", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 80, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 25, ctxt: 0 },
          name: { type: "Identifier", value: "className", span: { start: 5, end: 14, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "test-class",
            raw: '"test-class"',
            span: { start: 15, end: 25, ctxt: 0 },
          },
        } as JSXAttribute,
        {
          type: "JSXAttribute",
          span: { start: 26, end: 50, ctxt: 0 },
          name: { type: "Identifier", value: "data-node-id", span: { start: 26, end: 38, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "existing-id",
            raw: '"existing-id"',
            span: { start: 39, end: 50, ctxt: 0 },
          },
        } as JSXAttribute,
        {
          type: "JSXAttribute",
          span: { start: 51, end: 65, ctxt: 0 },
          name: { type: "Identifier", value: "id", span: { start: 51, end: 53, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "element-id",
            raw: '"element-id"',
            span: { start: 54, end: 65, ctxt: 0 },
          },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    addDataNodeIdAttribute(mockOpening, "updated-id");

    expect(mockOpening.attributes).toHaveLength(3); // Should not add new attribute

    // Check that other attributes are preserved
    expect(((mockOpening.attributes[0] as JSXAttribute).name as Identifier).value).toBe("className");
    expect(((mockOpening.attributes[2] as JSXAttribute).name as Identifier).value).toBe("id");

    // Check that data-node-id is updated
    const updatedAttr = mockOpening.attributes[1] as JSXAttribute;
    expect((updatedAttr.name as Identifier).value).toBe("data-node-id");
    if (updatedAttr.value && isStringLiteral(updatedAttr.value)) {
      expect(updatedAttr.value.value).toBe("updated-id");
    }
  });
});
