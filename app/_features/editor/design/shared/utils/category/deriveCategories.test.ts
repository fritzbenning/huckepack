import type { DesignPropertyKey } from "@editor/design/registry";
import type { DesignPropertyRegistryEntry } from "@editor/design/registry/types";
import type { DesignCategory } from "@editor/design/ui/design-category/types";
import { describe, expect, it } from "vitest";
import { deriveCategories } from "./deriveCategories";

describe("deriveCategories", () => {
  const createMockRule = (key: DesignPropertyKey, category: DesignCategory): DesignPropertyRegistryEntry => ({
    key,
    category,
    displayName: "Test",
    component: () => null,
    config: {
      features: {
        test: {
          type: "enum",
          classes: ["test-class"],
        },
      },
    },
    getDropdownValues: () => [],
  });

  it("should group rules by category", () => {
    const rules: DesignPropertyRegistryEntry[] = [
      createMockRule("flexLayout", "Layout"),
      createMockRule("width", "Dimensions"),
      createMockRule("height", "Dimensions"),
    ];

    const categories = deriveCategories(rules);

    const layoutCategory = categories.find((c) => c.name === "Layout");
    const dimensionsCategory = categories.find((c) => c.name === "Dimensions");

    expect(layoutCategory).toBeDefined();
    expect(layoutCategory?.rules.length).toBe(1);
    expect(layoutCategory?.rules[0].key).toBe("flexLayout");

    expect(dimensionsCategory).toBeDefined();
    expect(dimensionsCategory?.rules.length).toBe(2);
  });

  it("should preserve rules order within category", () => {
    const rules: DesignPropertyRegistryEntry[] = [
      createMockRule("flexLayout", "Layout"),
      createMockRule("borderRadius", "Layout"),
      createMockRule("opacity", "Layout"),
    ];

    const categories = deriveCategories(rules);

    const layoutCategory = categories.find((c) => c.name === "Layout");
    expect(layoutCategory?.rules.map((r) => r.key)).toEqual(["flexLayout", "borderRadius", "opacity"]);
  });

  it("should include all categories from DESIGN_CATEGORY_REGISTRY", () => {
    const rules: DesignPropertyRegistryEntry[] = [
      createMockRule("flexLayout", "Layout"),
      createMockRule("width", "Dimensions"),
    ];

    const categories = deriveCategories(rules);

    const categoryNames = categories.map((c) => c.name);
    expect(categoryNames).toContain("Position");
    expect(categoryNames).toContain("Dimensions");
    expect(categoryNames).toContain("Layout");
    expect(categoryNames).toContain("Spacing");
    expect(categoryNames).toContain("Background");
    expect(categoryNames).toContain("Stroke");
    expect(categoryNames).toContain("Appearance");
    expect(categoryNames).toContain("Effects");
    expect(categoryNames).toContain("Animation");
  });

  it("should preserve categories order from DESIGN_CATEGORIES", () => {
    const rules: DesignPropertyRegistryEntry[] = [
      createMockRule("flexLayout", "Layout"),
      createMockRule("width", "Dimensions"),
    ];

    const categories = deriveCategories(rules);

    const categoryNames = categories.map((c) => c.name);
    expect(categoryNames[0]).toBe("Position");
    expect(categoryNames[1]).toBe("Dimensions");
    expect(categoryNames[2]).toBe("Layout");
  });

  it("should handle empty rules array", () => {
    const rules: DesignPropertyRegistryEntry[] = [];
    const categories = deriveCategories(rules);

    expect(categories.length).toBeGreaterThan(0);
    categories.forEach((category) => {
      expect(category.rules.length).toBe(0);
    });
  });

  it("should skip rules without category", () => {
    const ruleWithoutCategory: DesignPropertyRegistryEntry = {
      key: "flexLayout",
      category: undefined as unknown as DesignCategory,
      displayName: "Test",
      component: () => null,
      config: {
        features: {
          test: {
            type: "enum",
            classes: ["test-class"],
          },
        },
      },
      getDropdownValues: () => [],
    };

    const rules: DesignPropertyRegistryEntry[] = [createMockRule("flexLayout", "Layout"), ruleWithoutCategory];

    const categories = deriveCategories(rules);

    const layoutCategory = categories.find((c) => c.name === "Layout");
    expect(layoutCategory?.rules.length).toBe(1);
    expect(layoutCategory?.rules[0].key).toBe("flexLayout");
  });

  it("should handle multiple rules in same category", () => {
    const rules: DesignPropertyRegistryEntry[] = [
      createMockRule("width", "Dimensions"),
      createMockRule("height", "Dimensions"),
      createMockRule("minWidth", "Dimensions"),
      createMockRule("maxWidth", "Dimensions"),
    ];

    const categories = deriveCategories(rules);

    const dimensionsCategory = categories.find((c) => c.name === "Dimensions");
    expect(dimensionsCategory?.rules.length).toBe(4);
    expect(dimensionsCategory?.rules.map((r) => r.key)).toEqual(["width", "height", "minWidth", "maxWidth"]);
  });

  it("should preserve all rule properties in category", () => {
    const rule: DesignPropertyRegistryEntry = {
      key: "flexLayout",
      category: "Layout",
      displayName: "Flex Layout",
      component: () => null,
      config: {
        features: {
          direction: {
            type: "enum",
            classes: ["flex-row", "flex-col"],
          },
        },
      },
      getDropdownValues: () => [],
      dependencies: {
        requires: ["position"],
      },
    };

    const categories = deriveCategories([rule]);

    const layoutCategory = categories.find((c) => c.name === "Layout");
    expect(layoutCategory?.rules[0]).toEqual(rule);
  });
});
