import type { DesignPropertyConfig } from "@editor/design/registry";
import { describe, expect, it } from "vitest";
import { getClassValue } from "./getClassValue";

describe("getClassValue", () => {
  const createConfig = (): DesignPropertyConfig => ({
    features: {
      flexDirection: {
        type: "enum",
        classes: ["flex-row", "flex-col"],
      },
      width: {
        type: "numeric",
        classes: ["w-0", "w-10", "w-20"],
      },
      display: {
        type: "toggle",
        classes: ["hidden", "block"],
      },
    },
  });

  it("should return first class when feature exists but no match", () => {
    const config = createConfig();
    expect(getClassValue(config, ["other-class"], "flexDirection")).toBe("flex-row");
  });

  it("should return matching class for enum feature", () => {
    const config = createConfig();
    expect(getClassValue(config, ["flex-col"], "flexDirection")).toBe("flex-col");
  });

  it("should return matching class for toggle feature", () => {
    const config = createConfig();
    expect(getClassValue(config, ["block"], "display")).toBe("block");
  });

  it("should return suffix for numeric feature", () => {
    const config = createConfig();
    expect(getClassValue(config, ["w-10"], "width")).toBe("10");
  });

  it("should return suffix for numeric when multiple matches", () => {
    const config = createConfig();
    expect(getClassValue(config, ["w-10", "w-20"], "width")).toBe("10");
  });

  it("should return first class suffix when no match for numeric", () => {
    const config = createConfig();
    expect(getClassValue(config, ["other-class"], "width")).toBe("0");
  });

  it("should return empty string when feature does not exist", () => {
    const config = createConfig();
    expect(getClassValue(config, ["any-class"], "nonExistent")).toBe("");
  });

  it("should handle null classTokens", () => {
    const config = createConfig();
    expect(getClassValue(config, null, "flexDirection")).toBe("flex-row");
  });

  it("should handle empty classTokens array", () => {
    const config = createConfig();
    expect(getClassValue(config, [], "flexDirection")).toBe("flex-row");
  });

  it("should handle numeric class without dash", () => {
    const config: DesignPropertyConfig = {
      features: {
        width: {
          type: "numeric",
          classes: ["w"],
        },
      },
    };
    expect(getClassValue(config, ["w"], "width")).toBe("w");
  });

  it("should handle numeric class with multiple dashes", () => {
    const config: DesignPropertyConfig = {
      features: {
        width: {
          type: "numeric",
          classes: ["w-10-20"],
        },
      },
    };
    expect(getClassValue(config, ["w-10-20"], "width")).toBe("20");
  });

  it("should return full class name for enum when no dash", () => {
    const config: DesignPropertyConfig = {
      features: {
        display: {
          type: "enum",
          classes: ["block"],
        },
      },
    };
    expect(getClassValue(config, ["block"], "display")).toBe("block");
  });
});
