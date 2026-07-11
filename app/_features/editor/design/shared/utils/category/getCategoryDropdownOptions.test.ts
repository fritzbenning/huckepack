import type { DesignPropertyKey, DesignPropertyRegistryEntry } from "@editor/design/registry/types";
import type { DropdownValue } from "@editor/design/ui/design-category/types";
import { describe, expect, it, vi } from "vitest";
import { getCategoryDropdownOptions } from "./getCategoryDropdownOptions";

describe("getCategoryDropdownOptions", () => {
  const createMockRule = (
    key: DesignPropertyKey,
    getDropdownValues: (props: Record<DesignPropertyKey, boolean>) => DropdownValue[]
  ): DesignPropertyRegistryEntry => {
    return {
      key,
      category: "Position",
      displayName: `Test ${key}`,
      component: () => null,
      config: { features: {} },
      getDropdownValues,
    };
  };

  it("should create dropdown options from rules with single dropdown value", () => {
    const rules = [
      createMockRule("position", () => [
        {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: [],
        },
      ]),
    ];
    const presentProperties = {} as Record<DesignPropertyKey, boolean>;

    const result = getCategoryDropdownOptions(rules, presentProperties);

    expect(result).toEqual([
      {
        value: "relative",
        label: "Relative",
        dropdownValue: {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: [],
        },
      },
    ]);
  });

  it("should create dropdown options from rules with multiple dropdown values", () => {
    const rules = [
      createMockRule("position", () => [
        {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: [],
        },
        {
          classToAdd: "absolute",
          label: "Absolute",
          siblingClasses: [],
        },
      ]),
    ];
    const presentProperties = {} as Record<DesignPropertyKey, boolean>;

    const result = getCategoryDropdownOptions(rules, presentProperties);

    expect(result).toEqual([
      {
        value: "relative",
        label: "Relative",
        dropdownValue: {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: [],
        },
        config: { features: {} },
      },
      {
        value: "absolute",
        label: "Absolute",
        dropdownValue: {
          classToAdd: "absolute",
          label: "Absolute",
          siblingClasses: [],
        },
        config: { features: {} },
      },
    ]);
  });

  it("should create dropdown options from multiple rules", () => {
    const rules = [
      createMockRule("position", () => [
        {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: [],
        },
      ]),
      createMockRule("width", () => [
        {
          classToAdd: "w-full",
          label: "Full width",
          siblingClasses: [],
        },
      ]),
    ];
    const presentProperties = {} as Record<DesignPropertyKey, boolean>;

    const result = getCategoryDropdownOptions(rules, presentProperties);

    expect(result).toEqual([
      {
        value: "relative",
        label: "Relative",
        dropdownValue: {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: [],
        },
        config: { features: {} },
      },
      {
        value: "w-full",
        label: "Full width",
        dropdownValue: {
          classToAdd: "w-full",
          label: "Full width",
          siblingClasses: [],
        },
        config: { features: {} },
      },
    ]);
  });

  it("should handle rules with sibling classes", () => {
    const rules = [
      createMockRule("position", () => [
        {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: ["absolute", "fixed"],
        },
      ]),
    ];
    const presentProperties = {} as Record<DesignPropertyKey, boolean>;

    const result = getCategoryDropdownOptions(rules, presentProperties);

    expect(result).toEqual([
      {
        value: "relative",
        label: "Relative",
        dropdownValue: {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: ["absolute", "fixed"],
        },
        config: { features: {} },
      },
    ]);
  });

  it("should pass presentProperties to getDropdownValues", () => {
    const getDropdownValuesSpy = vi.fn(() => []);
    const rules = [createMockRule("position", getDropdownValuesSpy)];
    const presentProperties = {
      position: true,
      width: false,
    } as Record<DesignPropertyKey, boolean>;

    getCategoryDropdownOptions(rules, presentProperties);

    expect(getDropdownValuesSpy).toHaveBeenCalledWith(presentProperties);
  });

  it("should handle rules that return empty dropdown values", () => {
    const rules = [
      createMockRule("position", () => []),
      createMockRule("width", () => [
        {
          classToAdd: "w-full",
          label: "Full width",
          siblingClasses: [],
        },
      ]),
    ];
    const presentProperties = {} as Record<DesignPropertyKey, boolean>;

    const result = getCategoryDropdownOptions(rules, presentProperties);

    expect(result).toEqual([
      {
        value: "w-full",
        label: "Full width",
        dropdownValue: {
          classToAdd: "w-full",
          label: "Full width",
          siblingClasses: [],
        },
        config: { features: {} },
      },
    ]);
  });

  it("should handle empty rules array", () => {
    const rules: DesignPropertyRegistryEntry[] = [];
    const presentProperties = {} as Record<DesignPropertyKey, boolean>;

    const result = getCategoryDropdownOptions(rules, presentProperties);

    expect(result).toEqual([]);
  });

  it("should handle rules with dynamic dropdown values based on presentProperties", () => {
    const rules = [
      createMockRule("position", (props) => {
        if (props.position) return [];
        return [
          {
            classToAdd: "relative",
            label: "Relative",
            siblingClasses: [],
          },
        ];
      }),
    ];
    const presentProperties = {
      position: false,
    } as Record<DesignPropertyKey, boolean>;

    const result = getCategoryDropdownOptions(rules, presentProperties);

    expect(result).toEqual([
      {
        value: "relative",
        label: "Relative",
        dropdownValue: {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: [],
        },
        config: { features: {} },
      },
    ]);
  });

  it("should handle rules with dynamic dropdown values that return empty when present", () => {
    const rules = [
      createMockRule("position", (props) => {
        if (props.position) return [];
        return [
          {
            classToAdd: "relative",
            label: "Relative",
            siblingClasses: [],
          },
        ];
      }),
    ];
    const presentProperties = {
      position: true,
    } as Record<DesignPropertyKey, boolean>;

    const result = getCategoryDropdownOptions(rules, presentProperties);

    expect(result).toEqual([]);
  });

  it("should preserve order of dropdown values from rules", () => {
    const rules = [
      createMockRule("position", () => [
        {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: [],
        },
        {
          classToAdd: "absolute",
          label: "Absolute",
          siblingClasses: [],
        },
        {
          classToAdd: "fixed",
          label: "Fixed",
          siblingClasses: [],
        },
      ]),
    ];
    const presentProperties = {} as Record<DesignPropertyKey, boolean>;

    const result = getCategoryDropdownOptions(rules, presentProperties);

    expect(result.map((opt) => opt.value)).toEqual(["relative", "absolute", "fixed"]);
  });

  it("should handle complex dropdown values with multiple sibling classes", () => {
    const rules = [
      createMockRule("position", () => [
        {
          classToAdd: "relative",
          label: "Relative",
          siblingClasses: ["absolute", "fixed", "sticky"],
        },
      ]),
    ];
    const presentProperties = {} as Record<DesignPropertyKey, boolean>;

    const result = getCategoryDropdownOptions(rules, presentProperties);

    expect(result[0].dropdownValue.siblingClasses).toEqual(["absolute", "fixed", "sticky"]);
  });
});
