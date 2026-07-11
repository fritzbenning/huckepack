import type { DesignPropertyKey, DesignPropertyRegistryEntry } from "@editor/design/registry/types";
import { describe, expect, it } from "vitest";
import { getPresentCategoryProperties } from "./getPresentCategoryProperties";

describe("getPresentCategoryProperties", () => {
  const createMockRule = (
    key: DesignPropertyKey,
    dependencies?: { showWhen?: (props: Record<DesignPropertyKey, boolean>) => boolean }
  ): DesignPropertyRegistryEntry => {
    return {
      key,
      category: "Position",
      displayName: `Test ${key}`,
      component: () => null,
      config: { features: {} },
      getDropdownValues: () => [],
      dependencies,
    };
  };

  it("should return rules that are present", () => {
    const rules = [createMockRule("position"), createMockRule("width"), createMockRule("height")];
    const presentProperties = {
      position: true,
      width: true,
      height: false,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([rules[0], rules[1]]);
  });

  it("should exclude rules that are not present", () => {
    const rules = [createMockRule("position"), createMockRule("width"), createMockRule("height")];
    const presentProperties = {
      position: false,
      width: false,
      height: false,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([]);
  });

  it("should exclude rules when showWhen returns false", () => {
    const rules = [
      createMockRule("position"),
      createMockRule("zIndex", {
        showWhen: (props) => props.position === true,
      }),
    ];
    const presentProperties = {
      position: true,
      zIndex: true,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([rules[0], rules[1]]);
  });

  it("should exclude rules when showWhen returns false even if property is present", () => {
    const rules = [
      createMockRule("position"),
      createMockRule("zIndex", {
        showWhen: (props) => props.position === false,
      }),
    ];
    const presentProperties = {
      position: true,
      zIndex: true,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([rules[0]]);
  });

  it("should include rules when showWhen returns true", () => {
    const rules = [
      createMockRule("position"),
      createMockRule("zIndex", {
        showWhen: (props) => props.position === true,
      }),
    ];
    const presentProperties = {
      position: true,
      zIndex: true,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([rules[0], rules[1]]);
  });

  it("should handle rules without dependencies", () => {
    const rules = [createMockRule("position"), createMockRule("width")];
    const presentProperties = {
      position: true,
      width: true,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual(rules);
  });

  it("should handle empty rules array", () => {
    const rules: DesignPropertyRegistryEntry[] = [];
    const presentProperties = {} as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([]);
  });

  it("should handle empty presentProperties", () => {
    const rules = [createMockRule("position"), createMockRule("width")];
    const presentProperties = {} as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([]);
  });

  it("should handle showWhen that checks multiple properties", () => {
    const rules = [
      createMockRule("position"),
      createMockRule("zIndex", {
        showWhen: (props) => props.position === true && props.width === true,
      }),
    ];
    const presentProperties = {
      position: true,
      width: true,
      zIndex: true,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([rules[0], rules[1]]);
  });

  it("should exclude rules when showWhen checks multiple properties and one is false", () => {
    const rules = [
      createMockRule("position"),
      createMockRule("zIndex", {
        showWhen: (props) => props.position === true && props.width === true,
      }),
    ];
    const presentProperties = {
      position: true,
      width: false,
      zIndex: true,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([rules[0]]);
  });

  it("should handle all rules present", () => {
    const rules = [createMockRule("position"), createMockRule("width"), createMockRule("height")];
    const presentProperties = {
      position: true,
      width: true,
      height: true,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual(rules);
  });

  it("should handle rules with showWhen that depends on other properties", () => {
    const rules = [
      createMockRule("position"),
      createMockRule("zIndex", {
        showWhen: (props) => props.position === true,
      }),
    ];
    const presentProperties = {
      position: true,
      zIndex: true,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([rules[0], rules[1]]);
  });

  it("should exclude rules when property is false even if showWhen would pass", () => {
    const rules = [
      createMockRule("position"),
      createMockRule("zIndex", {
        showWhen: (props) => props.position === true,
      }),
    ];
    const presentProperties = {
      position: true,
      zIndex: false,
    } as Record<DesignPropertyKey, boolean>;

    const result = getPresentCategoryProperties(rules, presentProperties);

    expect(result).toEqual([rules[0]]);
  });
});
