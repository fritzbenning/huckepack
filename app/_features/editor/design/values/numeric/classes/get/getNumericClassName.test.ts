import type { DesignPropertyConfig } from "@editor/design/registry";
import { describe, expect, it } from "vitest";
import { getNumericClassName } from "./getNumericClassName";

describe("getNumericClassName", () => {
  const createConfig = (): DesignPropertyConfig => ({
    features: {
      width: {
        type: "numeric",
        prefix: "w",
        classes: ["w-0", "w-1", "w-2"],
      },
      height: {
        type: "enum",
        prefix: "h",
        classes: ["h-auto", "h-full"],
      },
    },
  });

  it("should add featureKey prefix when targetClass does not include dash and feature is numeric", () => {
    const config = createConfig();
    const result = getNumericClassName(config.features.width, "width", "full");

    expect(result).toBe("width-full");
  });

  it("should return targetClass as-is when it includes dash", () => {
    const config = createConfig();
    const result = getNumericClassName(config.features.width, "width", "w-full");

    expect(result).toBe("w-full");
  });

  it("should return targetClass as-is when feature is not numeric", () => {
    const config = createConfig();
    const result = getNumericClassName(config.features.height, "height", "full");

    expect(result).toBe("full");
  });

  it("should handle empty targetClass", () => {
    const config = createConfig();
    const result = getNumericClassName(config.features.width, "width", "");

    expect(result).toBe("width-");
  });

  it("should handle targetClass with multiple dashes", () => {
    const config = createConfig();
    const result = getNumericClassName(config.features.width, "width", "w-full-screen");

    expect(result).toBe("w-full-screen");
  });

  it("should handle numeric targetClass", () => {
    const config = createConfig();
    const result = getNumericClassName(config.features.width, "width", "10");

    expect(result).toBe("width-10");
  });

  it("should handle targetClass starting with dash", () => {
    const config = createConfig();
    const result = getNumericClassName(config.features.width, "width", "-full");

    expect(result).toBe("-full");
  });

  it("should handle targetClass ending with dash", () => {
    const config = createConfig();
    const result = getNumericClassName(config.features.width, "width", "full-");

    expect(result).toBe("full-");
  });
});
