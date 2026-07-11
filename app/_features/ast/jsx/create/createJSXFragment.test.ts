import { isJSXFragment } from "@ast/type-check";
import { describe, expect, it } from "vitest";
import { createJSXElement } from "./createJSXElement";
import { createJSXFragment } from "./createJSXFragment";
import { createJSXText } from "./createJSXText";

describe("createJSXFragment", () => {
  it("should create empty JSX fragment", () => {
    const fragment = createJSXFragment();

    expect(fragment.type).toBe("JSXFragment");
    expect(fragment.span).toBeDefined();

    // Check opening fragment
    expect(fragment.opening.type).toBe("JSXOpeningFragment");
    expect(fragment.opening.span).toBeDefined();

    // Check closing fragment
    expect(fragment.closing.type).toBe("JSXClosingFragment");
    expect(fragment.closing.span).toBeDefined();

    // Check children
    expect(fragment.children).toEqual([]);
  });

  it("should create fragment with text children", () => {
    const textChild1 = createJSXText("Hello ");
    const textChild2 = createJSXText("World");
    const fragment = createJSXFragment([textChild1, textChild2]);

    expect(fragment.children).toHaveLength(2);
    expect(fragment.children[0]).toBe(textChild1);
    expect(fragment.children[1]).toBe(textChild2);
  });

  it("should create fragment with element children", () => {
    const elementChild = createJSXElement("div", [createJSXText("Content")]);
    const fragment = createJSXFragment([elementChild]);

    expect(fragment.children).toHaveLength(1);
    expect(fragment.children[0]).toBe(elementChild);
  });

  it("should create fragment with mixed children", () => {
    const textChild = createJSXText("Text ");
    const elementChild = createJSXElement("span", [createJSXText("Element")]);
    const fragment = createJSXFragment([textChild, elementChild]);

    expect(fragment.children).toHaveLength(2);
    expect(fragment.children[0]).toBe(textChild);
    expect(fragment.children[1]).toBe(elementChild);
  });

  it("should create nested fragments", () => {
    const innerFragment = createJSXFragment([createJSXText("Inner")]);
    const outerFragment = createJSXFragment([innerFragment]);

    expect(outerFragment.children).toHaveLength(1);
    expect(outerFragment.children[0]).toBe(innerFragment);
    if (isJSXFragment(outerFragment.children[0])) {
      expect(outerFragment.children[0].type).toBe("JSXFragment");
    }
  });
});
