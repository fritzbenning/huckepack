import { describe, expect, it, vi } from "vitest";
import { optimizeOutputClasses } from "./optimizeOutputClasses";

vi.mock("./compressClasses", () => ({
  compressClasses: vi.fn((classes: string[]) => {
    const result: string[] = [];
    const hasW10 = classes.includes("w-10");
    const hasH10 = classes.includes("h-10");

    if (hasW10 && hasH10) {
      result.push("size-10");
      // Add other classes that aren't w-10 or h-10
      for (const cls of classes) {
        if (cls !== "w-10" && cls !== "h-10") {
          result.push(cls);
        }
      }
      return result;
    }
    return classes;
  }),
}));

describe("optimizeOutputClasses", () => {
  it("should add new classes and remove specified ones", () => {
    const result = optimizeOutputClasses(["new-class"], ["old-class"], ["old-class", "existing-class"]);
    expect(result.optimizedAdd).toContain("new-class");
    expect(result.optimizedRemove).toContain("old-class");
    expect(result.optimizedRemove).not.toContain("existing-class");
  });

  it("should compress classes when possible", () => {
    const result = optimizeOutputClasses(["w-10", "h-10"], [], ["p-4"]);
    expect(result.optimizedAdd).toContain("size-10");
    expect(result.optimizedAdd).not.toContain("w-10");
    expect(result.optimizedAdd).not.toContain("h-10");
  });

  it("should handle empty existing classes", () => {
    const result = optimizeOutputClasses(["new-class"], [], []);
    expect(result.optimizedAdd).toContain("new-class");
    expect(result.optimizedRemove).toEqual([]);
  });

  it("should handle empty add and remove arrays", () => {
    const result = optimizeOutputClasses([], [], ["existing-class"]);
    expect(result.optimizedAdd).toEqual([]);
    expect(result.optimizedRemove).toEqual([]);
  });

  it("should remove classes that are no longer in compressed result", () => {
    const result = optimizeOutputClasses(["w-10", "h-10"], [], ["w-10", "h-10", "p-4"]);
    expect(result.optimizedRemove).toContain("w-10");
    expect(result.optimizedRemove).toContain("h-10");
    expect(result.optimizedAdd).toContain("size-10");
  });

  it("should not add classes that already exist", () => {
    const result = optimizeOutputClasses(["existing-class"], [], ["existing-class"]);
    expect(result.optimizedAdd).not.toContain("existing-class");
  });

  it("should handle undefined existing classes", () => {
    const result = optimizeOutputClasses(["new-class"], [], undefined);
    expect(result.optimizedAdd).toContain("new-class");
    expect(result.optimizedRemove).toEqual([]);
  });
});
