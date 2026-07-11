import type { DesignPropertyKey } from "@editor/design/registry";
import type { DesignPropertyRegistryEntry } from "@editor/design/registry/types";
import { describe, expect, it } from "vitest";
import { createRegistry } from "./createRegistry";

describe("createRegistry", () => {
  const createMockRule = (key: DesignPropertyKey): DesignPropertyRegistryEntry => ({
    key,
    category: "Layout",
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

  it("should create registry from rules array", () => {
    const rules: DesignPropertyRegistryEntry[] = [createMockRule("flexLayout"), createMockRule("width")];

    const registry = createRegistry(rules);

    expect(registry.flexLayout).toBeDefined();
    expect(registry.width).toBeDefined();
    expect(registry.flexLayout.key).toBe("flexLayout");
    expect(registry.width.key).toBe("width");
  });

  it("should handle empty array", () => {
    const rules: DesignPropertyRegistryEntry[] = [];
    const registry = createRegistry(rules);

    expect(Object.keys(registry).length).toBe(0);
  });

  it("should handle single rule", () => {
    const rules: DesignPropertyRegistryEntry[] = [createMockRule("flexLayout")];
    const registry = createRegistry(rules);

    expect(Object.keys(registry).length).toBe(1);
    expect(registry.flexLayout).toBeDefined();
  });

  it("should overwrite duplicate keys", () => {
    const rule1 = createMockRule("flexLayout");
    const rule2 = createMockRule("flexLayout");

    const rules: DesignPropertyRegistryEntry[] = [rule1, rule2];
    const registry = createRegistry(rules);

    expect(Object.keys(registry).length).toBe(1);
    expect(registry.flexLayout.key).toBe("flexLayout");
  });

  it("should preserve all rule properties", () => {
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
      getDropdownValues: () => [
        {
          classToAdd: "flex",
          label: "Flex",
          siblingClasses: [],
        },
      ],
      dependencies: {
        requires: ["position"],
      },
    };

    const registry = createRegistry([rule]);

    expect(registry.flexLayout).toEqual(rule);
  });

  it("should handle multiple rules with different keys", () => {
    const rules: DesignPropertyRegistryEntry[] = [
      createMockRule("flexLayout"),
      createMockRule("width"),
      createMockRule("height"),
      createMockRule("padding"),
    ];

    const registry = createRegistry(rules);

    expect(Object.keys(registry).length).toBe(4);
    expect(registry.flexLayout).toBeDefined();
    expect(registry.width).toBeDefined();
    expect(registry.height).toBeDefined();
    expect(registry.padding).toBeDefined();
  });
});
