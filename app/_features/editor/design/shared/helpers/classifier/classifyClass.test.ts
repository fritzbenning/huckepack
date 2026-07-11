import { describe, expect, it, vi } from "vitest";
import { classifyClass } from "./classifyClass";

vi.mock("@editor/design/class-classifier/background", () => ({
  classifyBackgroundClass: vi.fn((cls: string) => {
    if (cls.startsWith("bg-") || cls.startsWith("from-") || cls.startsWith("via-") || cls.startsWith("to-")) {
      return "backgroundColor";
    }
    return null;
  }),
}));

vi.mock("@editor/design/class-classifier/text", () => ({
  classifyTextClass: vi.fn((cls: string) => {
    if (cls.startsWith("text-")) {
      return "fontSize";
    }
    return null;
  }),
}));

describe("classifyClass", () => {
  it("should route bg- classes to background classifier", () => {
    const result = classifyClass("bg-red-500");
    expect(result).toBe("backgroundColor");
  });

  it("should route gradient stop classes to background classifier", () => {
    expect(classifyClass("from-red-500")).toBe("backgroundColor");
    expect(classifyClass("via-blue-500")).toBe("backgroundColor");
    expect(classifyClass("to-green-500")).toBe("backgroundColor");
  });

  it("should route text- classes to text classifier", () => {
    const result = classifyClass("text-lg");
    expect(result).toBe("fontSize");
  });

  it("should return null for classes that don't match any classifier", () => {
    expect(classifyClass("p-4")).toBeNull();
    expect(classifyClass("m-8")).toBeNull();
    expect(classifyClass("flex")).toBeNull();
  });
});

