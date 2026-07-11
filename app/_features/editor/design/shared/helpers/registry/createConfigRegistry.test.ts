import type { DesignPropertyKey } from "@editor/design/registry";
import type { DesignPropertyConfig, DesignPropertyRegistryEntry } from "@editor/design/registry/types";
import { describe, expect, it } from "vitest";
import { createConfigRegistry } from "./createConfigRegistry";

describe("createConfigRegistry", () => {
  const createMockRule = (key: DesignPropertyKey, config: DesignPropertyConfig): DesignPropertyRegistryEntry => ({
    key,
    category: "Layout",
    displayName: "Test",
    component: () => null,
    config,
    getDropdownValues: () => [],
  });

  it("should create config registry from rules array", () => {
    const config1: DesignPropertyConfig = {
      features: {
        direction: {
          type: "enum",
          classes: ["flex-row", "flex-col"],
        },
      },
    };

    const config2: DesignPropertyConfig = {
      features: {
        width: {
          type: "numeric",
          classes: ["w-0", "w-10"],
        },
      },
    };

    const rules: DesignPropertyRegistryEntry[] = [
      createMockRule("flexLayout", config1),
      createMockRule("width", config2),
    ];

    const registry = createConfigRegistry(rules);

    expect(registry.flexLayout).toBe(config1);
    expect(registry.width).toBe(config2);
  });

  it("should handle empty array", () => {
    const rules: DesignPropertyRegistryEntry[] = [];
    const registry = createConfigRegistry(rules);

    expect(Object.keys(registry).length).toBe(0);
  });

  it("should handle single rule", () => {
    const config: DesignPropertyConfig = {
      features: {
        test: {
          type: "enum",
          classes: ["test-class"],
        },
      },
    };

    const rules: DesignPropertyRegistryEntry[] = [createMockRule("flexLayout", config)];
    const registry = createConfigRegistry(rules);

    expect(Object.keys(registry).length).toBe(1);
    expect(registry.flexLayout).toBe(config);
  });

  it("should overwrite duplicate keys", () => {
    const config1: DesignPropertyConfig = {
      features: {
        test1: {
          type: "enum",
          classes: ["test1"],
        },
      },
    };

    const config2: DesignPropertyConfig = {
      features: {
        test2: {
          type: "enum",
          classes: ["test2"],
        },
      },
    };

    const rules: DesignPropertyRegistryEntry[] = [
      createMockRule("flexLayout", config1),
      createMockRule("flexLayout", config2),
    ];

    const registry = createConfigRegistry(rules);

    expect(Object.keys(registry).length).toBe(1);
    expect(registry.flexLayout).toBe(config2);
  });

  it("should preserve config with individualMode", () => {
    const config: DesignPropertyConfig = {
      features: {
        padding: {
          type: "numeric",
          classes: ["p-0"],
        },
      },
      individualMode: {
        unified: "padding",
        individual: ["paddingTop", "paddingRight"],
      },
    };

    const rules: DesignPropertyRegistryEntry[] = [createMockRule("padding", config)];
    const registry = createConfigRegistry(rules);

    expect(registry.padding).toBe(config);
    expect(registry.padding.individualMode).toBeDefined();
    expect(registry.padding.individualMode?.unified).toBe("padding");
  });

  it("should handle multiple rules with different configs", () => {
    const configs: DesignPropertyConfig[] = [
      {
        features: {
          a: { type: "enum", classes: ["a"] },
        },
      },
      {
        features: {
          b: { type: "enum", classes: ["b"] },
        },
      },
      {
        features: {
          c: { type: "enum", classes: ["c"] },
        },
      },
    ];

    const rules: DesignPropertyRegistryEntry[] = [
      createMockRule("flexLayout", configs[0]),
      createMockRule("width", configs[1]),
      createMockRule("height", configs[2]),
    ];

    const registry = createConfigRegistry(rules);

    expect(Object.keys(registry).length).toBe(3);
    expect(registry.flexLayout).toBe(configs[0]);
    expect(registry.width).toBe(configs[1]);
    expect(registry.height).toBe(configs[2]);
  });
});
