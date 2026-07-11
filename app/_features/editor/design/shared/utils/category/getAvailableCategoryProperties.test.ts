import type { DesignPropertyKey, DesignPropertyRegistryEntry } from "@editor/design/registry/types";
import { describe, expect, it } from "vitest";
import { getAvailableCategoryProperties } from "./getAvailableCategoryProperties";

describe("getAvailableCategoryProperties", () => {
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

  it("should return rules that are not present", () => {
    const rules: DesignPropertyRegistryEntry[] = [createMockRule("flexLayout"), createMockRule("width")];
    const presentProperties: Record<DesignPropertyKey, boolean> = {
      flexLayout: true,
      width: false,
    } as Record<DesignPropertyKey, boolean>;

    const result = getAvailableCategoryProperties(rules, presentProperties);

    expect(result.length).toBe(1);
    expect(result[0].key).toBe("width");
  });

  it("should return all rules when none are present", () => {
    const rules: DesignPropertyRegistryEntry[] = [createMockRule("flexLayout"), createMockRule("width")];
    const presentProperties: Record<DesignPropertyKey, boolean> = {
      flexLayout: false,
      width: false,
    } as Record<DesignPropertyKey, boolean>;

    const result = getAvailableCategoryProperties(rules, presentProperties);

    expect(result.length).toBe(2);
  });

  it("should return empty array when all rules are present", () => {
    const rules: DesignPropertyRegistryEntry[] = [createMockRule("flexLayout")];
    const presentProperties: Record<DesignPropertyKey, boolean> = {
      flexLayout: true,
    } as Record<DesignPropertyKey, boolean>;

    const result = getAvailableCategoryProperties(rules, presentProperties);

    expect(result.length).toBe(0);
  });
});
