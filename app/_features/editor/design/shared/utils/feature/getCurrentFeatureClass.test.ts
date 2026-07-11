import type { DesignPropertyConfig } from "@editor/design/registry";
import { describe, expect, it } from "vitest";
import { getCurrentFeatureClass } from "./getCurrentFeatureClass";

describe("getCurrentFeatureClass", () => {
  const createConfig = (): DesignPropertyConfig => ({
    features: {
      flexDirection: {
        type: "enum",
        prefix: "flex",
        classes: ["flex-row", "flex-col"],
      },
      width: {
        type: "numeric",
        prefix: "w",
        classes: ["w-0", "w-1", "w-2"],
      },
      height: {
        type: "numeric",
        prefix: "h",
        classes: ["h-auto", "h-full"],
      },
    },
  });

  it("should return empty string when feature does not exist", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, ["flex-row"], "nonExistent");

    expect(result).toBe("");
  });

  it("should return empty string when classTokens is null", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, null, "flexDirection");

    expect(result).toBe("");
  });

  it("should return empty string when classTokens is empty", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, [], "flexDirection");

    expect(result).toBe("");
  });

  it("should return matching class for enum feature", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, ["flex-col", "other-class"], "flexDirection");

    expect(result).toBe("flex-col");
  });

  it("should return first matching class when multiple match", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, ["flex-row", "flex-col"], "flexDirection");

    expect(result).toBe("flex-row");
  });

  it("should return empty string when no class matches for enum feature", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, ["other-class"], "flexDirection");

    expect(result).toBe("");
  });

  it("should return matching class for numeric feature with prefix", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, ["w-1", "other-class"], "width");

    expect(result).toBe("w-1");
  });

  it("should return matching class for numeric feature with normalized prefix", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, ["w-2"], "width");

    expect(result).toBe("w-2");
  });

  it("should return prefix when it matches exactly for numeric", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, ["w"], "width");

    expect(result).toBe("w");
  });

  it("should return empty string when no class matches for numeric feature", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, ["other-class"], "width");

    expect(result).toBe("");
  });

  it("should use featureKey as prefix when keys is not provided for numeric", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, ["height-auto"], "height");

    expect(result).toBe("height-auto");
  });

  it("should handle numeric feature with prefix ending in dash", () => {
    const config: DesignPropertyConfig = {
      features: {
        width: {
          type: "numeric",
          prefix: "w-",
          classes: ["w-0", "w-1"],
        },
      },
    };
    const result = getCurrentFeatureClass(config, ["w-1"], "width");

    expect(result).toBe("w-1");
  });

  it("should handle classTokens with multiple matching classes", () => {
    const config = createConfig();
    const result = getCurrentFeatureClass(config, ["w-0", "w-1", "w-2"], "width");

    expect(result).toBe("w-0");
  });
});
