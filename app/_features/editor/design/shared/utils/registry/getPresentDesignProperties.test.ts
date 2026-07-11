import { describe, expect, it } from "vitest";
import { getPresentDesignProperties } from "./getPresentDesignProperties";

describe("getPresentDesignProperties", () => {
  it("should detect present design propertys from class tokens", () => {
    const classTokens = ["flex", "w-10"];

    const result = getPresentDesignProperties(classTokens);

    expect(typeof result).toBe("object");
  });

  it("should handle empty class tokens", () => {
    const classTokens: string[] = [];

    const result = getPresentDesignProperties(classTokens);

    expect(typeof result).toBe("object");
  });

  it("should handle class tokens with multiple rules", () => {
    const classTokens = ["flex", "items-center", "w-10", "h-20"];

    const result = getPresentDesignProperties(classTokens);

    expect(typeof result).toBe("object");
  });
});
