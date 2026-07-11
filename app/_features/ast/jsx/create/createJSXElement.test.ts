import { describe, expect, it } from "vitest";
import { createJSXElement } from "./createJSXElement";
import { createJSXText } from "./createJSXText";

describe("createJSXElement", () => {
  it("should create a JSX element with correct structure", () => {
    const element = createJSXElement("div");

    expect(element.type).toBe("JSXElement");
    expect(element.span).toBeDefined();

    // Check opening tag
    expect(element.opening.type).toBe("JSXOpeningElement");
    expect(element.opening.name.type).toBe("Identifier");
    expect((element.opening.name as { value: string }).value).toBe("div");
    expect(element.opening.attributes).toEqual([]);
    expect(element.opening.selfClosing).toBe(false);

    // Check closing tag
    expect(element.closing?.type).toBe("JSXClosingElement");
    expect(element.closing?.name.type).toBe("Identifier");
    expect((element.closing?.name as { value: string })?.value).toBe("div");

    // Check children
    expect(element.children).toEqual([]);
  });

  it("should create element with children", () => {
    const textChild = createJSXText("Hello World");
    const element = createJSXElement("p", [textChild]);

    expect((element.opening.name as { value: string }).value).toBe("p");
    expect(element.children).toHaveLength(1);
    expect(element.children[0]).toBe(textChild);
  });

  it("should create element with custom component name", () => {
    const element = createJSXElement("MyComponent");

    expect((element.opening.name as { value: string }).value).toBe("MyComponent");
    expect((element.closing?.name as { value: string })?.value).toBe("MyComponent");
  });

  it("should create element with multiple children", () => {
    const child1 = createJSXText("First ");
    const child2 = createJSXText("Second");
    const element = createJSXElement("span", [child1, child2]);

    expect(element.children).toHaveLength(2);
    expect(element.children[0]).toBe(child1);
    expect(element.children[1]).toBe(child2);
  });

  it("should create nested elements", () => {
    const innerElement = createJSXElement("span", [createJSXText("Inner")]);
    const outerElement = createJSXElement("div", [innerElement]);

    expect(outerElement.children).toHaveLength(1);
    expect(outerElement.children[0]).toBe(innerElement);
    expect((outerElement.children[0] as { opening: { name: { value: string } } }).opening.name.value).toBe("span");
  });
});
