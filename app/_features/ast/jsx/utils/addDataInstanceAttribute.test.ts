import { isStringLiteral } from "@ast/type-check";
import type { Identifier, JSXAttribute, JSXOpeningElement, SpreadElement } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { addDataInstanceAttribute } from "./addDataInstanceAttribute";

describe("addDataInstanceAttribute", () => {
  it("should add data-instance attribute when it doesn't exist", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    addDataInstanceAttribute(mockOpening);

    expect(mockOpening.attributes).toHaveLength(1);
    const attr = mockOpening.attributes[0] as JSXAttribute;
    expect(attr.type).toBe("JSXAttribute");
    expect((attr.name as Identifier).value).toBe("data-instance");
    if (attr.value && isStringLiteral(attr.value)) {
      expect(attr.value.value).toBe("true");
      expect(attr.value.raw).toBe('"true"');
    }
  });

  it("should update existing data-instance attribute to true", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 30, ctxt: 0 },
          name: { type: "Identifier", value: "data-instance", span: { start: 5, end: 18, ctxt: 0 } } as Identifier,
          value: { type: "StringLiteral", value: "false", raw: '"false"', span: { start: 19, end: 26, ctxt: 0 } },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    addDataInstanceAttribute(mockOpening);

    expect(mockOpening.attributes).toHaveLength(1); // Should not add new attribute
    const attr = mockOpening.attributes[0] as JSXAttribute;
    expect((attr.name as Identifier).value).toBe("data-instance");
    if (attr.value && isStringLiteral(attr.value)) {
      expect(attr.value.value).toBe("true");
      expect(attr.value.raw).toBe('"true"');
    }
  });

  it("should add data-instance attribute alongside existing attributes", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "MyComponent", span: { start: 1, end: 12, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 13, end: 33, ctxt: 0 },
          name: { type: "Identifier", value: "className", span: { start: 13, end: 22, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "test-class",
            raw: '"test-class"',
            span: { start: 23, end: 33, ctxt: 0 },
          },
        } as JSXAttribute,
        {
          type: "JSXAttribute",
          span: { start: 34, end: 43, ctxt: 0 },
          name: { type: "Identifier", value: "id", span: { start: 34, end: 36, ctxt: 0 } } as Identifier,
          value: { type: "StringLiteral", value: "test-id", raw: '"test-id"', span: { start: 37, end: 43, ctxt: 0 } },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    addDataInstanceAttribute(mockOpening);

    expect(mockOpening.attributes).toHaveLength(3);

    // Check existing attributes are preserved
    expect(((mockOpening.attributes[0] as JSXAttribute).name as Identifier).value).toBe("className");
    expect(((mockOpening.attributes[1] as JSXAttribute).name as Identifier).value).toBe("id");

    // Check new attribute is added
    const newAttr = mockOpening.attributes[2] as JSXAttribute;
    expect((newAttr.name as Identifier).value).toBe("data-instance");
    if (newAttr.value && isStringLiteral(newAttr.value)) {
      expect(newAttr.value.value).toBe("true");
    }
  });

  it("should not affect non-JSXAttribute elements", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "Component", span: { start: 1, end: 10, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "SpreadElement",
          span: { start: 11, end: 21, ctxt: 0 },
          spread: { start: 11, end: 14, ctxt: 0 },
          arguments: {
            type: "Identifier",
            value: "props",
            span: { start: 14, end: 19, ctxt: 0 },
            ctxt: 0,
            optional: false,
          },
        } as SpreadElement,
      ],
      selfClosing: false,
    };

    addDataInstanceAttribute(mockOpening);

    expect(mockOpening.attributes).toHaveLength(2);
    expect(mockOpening.attributes[0].type).toBe("SpreadElement"); // Preserved
    expect((mockOpening.attributes[1] as JSXAttribute).type).toBe("JSXAttribute"); // Added
    expect(((mockOpening.attributes[1] as JSXAttribute).name as Identifier).value).toBe("data-instance");
  });

  it("should update data-instance when mixed with other attributes", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 80, ctxt: 0 },
      name: { type: "Identifier", value: "Button", span: { start: 1, end: 7, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 8, end: 28, ctxt: 0 },
          name: { type: "Identifier", value: "className", span: { start: 8, end: 17, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "btn-primary",
            raw: '"btn-primary"',
            span: { start: 18, end: 28, ctxt: 0 },
          },
        } as JSXAttribute,
        {
          type: "JSXAttribute",
          span: { start: 29, end: 50, ctxt: 0 },
          name: { type: "Identifier", value: "data-instance", span: { start: 29, end: 42, ctxt: 0 } } as Identifier,
          value: { type: "StringLiteral", value: "false", raw: '"false"', span: { start: 43, end: 50, ctxt: 0 } },
        } as JSXAttribute,
        {
          type: "JSXAttribute",
          span: { start: 51, end: 65, ctxt: 0 },
          name: { type: "Identifier", value: "onClick", span: { start: 51, end: 58, ctxt: 0 } } as Identifier,
          value: {
            type: "JSXExpressionContainer",
            span: { start: 59, end: 65, ctxt: 0 },
            expression: {
              type: "Identifier",
              value: "handler",
              span: { start: 60, end: 67, ctxt: 0 },
              ctxt: 0,
              optional: false,
            },
          },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    addDataInstanceAttribute(mockOpening);

    expect(mockOpening.attributes).toHaveLength(3); // Should not add new attribute

    // Check that other attributes are preserved
    expect(((mockOpening.attributes[0] as JSXAttribute).name as Identifier).value).toBe("className");
    expect(((mockOpening.attributes[2] as JSXAttribute).name as Identifier).value).toBe("onClick");

    // Check that data-instance is updated
    const updatedAttr = mockOpening.attributes[1] as JSXAttribute;
    expect((updatedAttr.name as Identifier).value).toBe("data-instance");
    if (updatedAttr.value && isStringLiteral(updatedAttr.value)) {
      expect(updatedAttr.value.value).toBe("true");
    }
  });

  it("should handle self-closing elements", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "img", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 15, ctxt: 0 },
          name: { type: "Identifier", value: "src", span: { start: 5, end: 8, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "image.jpg",
            raw: '"image.jpg"',
            span: { start: 9, end: 15, ctxt: 0 },
          },
        } as JSXAttribute,
      ],
      selfClosing: true,
    };

    addDataInstanceAttribute(mockOpening);

    expect(mockOpening.attributes).toHaveLength(2);
    expect(mockOpening.selfClosing).toBe(true); // Should preserve self-closing

    const newAttr = mockOpening.attributes[1] as JSXAttribute;
    expect((newAttr.name as Identifier).value).toBe("data-instance");
    if (newAttr.value && isStringLiteral(newAttr.value)) {
      expect(newAttr.value.value).toBe("true");
    }
  });

  it("should handle components with no existing attributes", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 15, ctxt: 0 },
      name: { type: "Identifier", value: "CustomComponent", span: { start: 1, end: 16, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    addDataInstanceAttribute(mockOpening);

    expect(mockOpening.attributes).toHaveLength(1);
    const attr = mockOpening.attributes[0] as JSXAttribute;
    expect((attr.name as Identifier).value).toBe("data-instance");
    if (attr.value && isStringLiteral(attr.value)) {
      expect(attr.value.value).toBe("true");
    }
  });
});
