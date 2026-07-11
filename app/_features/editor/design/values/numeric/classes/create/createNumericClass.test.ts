import type { ClassNormalizer } from "@editor/design/shared/helpers/normalizer/types";
import { describe, expect, it, vi } from "vitest";
import { createNumericClass } from "./createNumericClass";

vi.mock("@editor/design/values/numeric-value/utils/roundToQuarterStep", () => ({
  roundToQuarterStep: vi.fn((value) => Math.round(value * 4) / 4),
}));

describe("createNumericClass", () => {
  it("should format scale unit as numeric class", () => {
    expect(createNumericClass("w", 4, "scale")).toBe("w-4");
    expect(createNumericClass("w", 8, "scale")).toBe("w-8");
  });

  it("should format px unit as arbitrary value", () => {
    expect(createNumericClass("w", 16, "px")).toBe("w-[16px]");
    expect(createNumericClass("w", 32, "px")).toBe("w-[32px]");
  });

  it("should format rem unit as arbitrary value", () => {
    expect(createNumericClass("w", 1, "rem")).toBe("w-[1rem]");
    expect(createNumericClass("w", 1.5, "rem")).toBe("w-[1.5rem]");
  });

  it("should format percent unit as arbitrary value", () => {
    expect(createNumericClass("w", 50, "%")).toBe("w-[50%]");
    expect(createNumericClass("w", 100, "%")).toBe("w-[100%]");
  });

  it("should format vw unit as arbitrary value", () => {
    expect(createNumericClass("w", 100, "vw")).toBe("w-[100vw]");
  });

  it("should format vh unit as arbitrary value", () => {
    expect(createNumericClass("h", 100, "vh")).toBe("h-[100vh]");
  });

  it("should use normalizer when provided", () => {
    const normalizer: ClassNormalizer = {
      property: "w",
      normalizers: [],
      normalize: vi.fn(() => "w-1/2"),
    };

    const result = createNumericClass("w", 50, "%", normalizer);

    expect(normalizer.normalize).toHaveBeenCalledWith(50, "%");
    expect(result).toBe("w-1/2");
  });

  it("should round scale values to quarter steps", () => {
    expect(createNumericClass("w", 4.25, "scale")).toBe("w-4.25");
    expect(createNumericClass("w", 4.5, "scale")).toBe("w-4.5");
  });

  it("should handle decimal values in arbitrary syntax", () => {
    expect(createNumericClass("w", 16.5, "px")).toBe("w-[16.5px]");
    expect(createNumericClass("w", 1.25, "rem")).toBe("w-[1.25rem]");
  });

  it("should handle zero values", () => {
    expect(createNumericClass("w", 0, "scale")).toBe("w-0");
    expect(createNumericClass("w", 0, "px")).toBe("w-[0px]");
  });
});
