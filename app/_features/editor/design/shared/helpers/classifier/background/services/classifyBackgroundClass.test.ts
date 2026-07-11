import { describe, expect, it } from "vitest";
import { classifyBackgroundClass } from "./classifyBackgroundClass";

describe("classifyBackgroundClass", () => {
  it("should classify background color classes", () => {
    expect(classifyBackgroundClass("bg-red-500")).toBe("backgroundColor");
    expect(classifyBackgroundClass("bg-blue-600")).toBe("backgroundColor");
    expect(classifyBackgroundClass("bg-green-400")).toBe("backgroundColor");
    expect(classifyBackgroundClass("bg-[#fff]")).toBe("backgroundColor");
    expect(classifyBackgroundClass("bg-[#000000]")).toBe("backgroundColor");
    expect(classifyBackgroundClass("bg-[rgb(255,0,0)]")).toBe("backgroundColor");
    expect(classifyBackgroundClass("bg-transparent")).toBe("backgroundColor");
    expect(classifyBackgroundClass("bg-current")).toBe("backgroundColor");
  });

  it("should classify background image classes", () => {
    expect(classifyBackgroundClass("bg-none")).toBe("backgroundImage");
    expect(classifyBackgroundClass("bg-[url('test.jpg')]")).toBe("backgroundImage");
    expect(classifyBackgroundClass("bg-[url('https://example.com/image.png')]")).toBe("backgroundImage");
    expect(classifyBackgroundClass("bg-linear-to-r")).toBe("backgroundImage");
    expect(classifyBackgroundClass("bg-gradient-to-r")).toBe("backgroundImage");
    expect(classifyBackgroundClass("bg-gradient-to-b")).toBe("backgroundImage");
  });

  it("should classify gradient stop classes as backgroundImage", () => {
    expect(classifyBackgroundClass("from-red-500")).toBe("backgroundImage");
    expect(classifyBackgroundClass("from-blue-600")).toBe("backgroundImage");
    expect(classifyBackgroundClass("via-blue-500")).toBe("backgroundImage");
    expect(classifyBackgroundClass("via-green-400")).toBe("backgroundImage");
    expect(classifyBackgroundClass("to-green-500")).toBe("backgroundImage");
    expect(classifyBackgroundClass("to-purple-700")).toBe("backgroundImage");
  });

  it("should classify background size classes", () => {
    expect(classifyBackgroundClass("bg-cover")).toBe("backgroundSize");
    expect(classifyBackgroundClass("bg-contain")).toBe("backgroundSize");
    expect(classifyBackgroundClass("bg-auto")).toBe("backgroundSize");
  });

  it("should classify background position classes", () => {
    expect(classifyBackgroundClass("bg-center")).toBe("backgroundPosition");
    expect(classifyBackgroundClass("bg-top")).toBe("backgroundPosition");
    expect(classifyBackgroundClass("bg-bottom")).toBe("backgroundPosition");
    expect(classifyBackgroundClass("bg-left")).toBe("backgroundPosition");
    expect(classifyBackgroundClass("bg-right")).toBe("backgroundPosition");
  });

  it("should classify background repeat classes", () => {
    expect(classifyBackgroundClass("bg-repeat")).toBe("backgroundRepeat");
    expect(classifyBackgroundClass("bg-no-repeat")).toBe("backgroundRepeat");
    expect(classifyBackgroundClass("bg-repeat-x")).toBe("backgroundRepeat");
    expect(classifyBackgroundClass("bg-repeat-y")).toBe("backgroundRepeat");
    expect(classifyBackgroundClass("bg-repeat-round")).toBe("backgroundRepeat");
    expect(classifyBackgroundClass("bg-repeat-space")).toBe("backgroundRepeat");
  });

  it("should classify background origin classes", () => {
    expect(classifyBackgroundClass("bg-origin-border")).toBe("backgroundOrigin");
    expect(classifyBackgroundClass("bg-origin-padding")).toBe("backgroundOrigin");
    expect(classifyBackgroundClass("bg-origin-content")).toBe("backgroundOrigin");
  });

  it("should classify background attachment classes", () => {
    expect(classifyBackgroundClass("bg-fixed")).toBe("backgroundAttachment");
    expect(classifyBackgroundClass("bg-local")).toBe("backgroundAttachment");
    expect(classifyBackgroundClass("bg-scroll")).toBe("backgroundAttachment");
  });

  it("should classify background clip classes", () => {
    expect(classifyBackgroundClass("bg-clip-border")).toBe("backgroundClip");
    expect(classifyBackgroundClass("bg-clip-padding")).toBe("backgroundClip");
    expect(classifyBackgroundClass("bg-clip-content")).toBe("backgroundClip");
    expect(classifyBackgroundClass("bg-clip-text")).toBe("backgroundClip");
  });

  it("should return null for non-background classes", () => {
    expect(classifyBackgroundClass("text-red-500")).toBeNull();
    expect(classifyBackgroundClass("p-4")).toBeNull();
    expect(classifyBackgroundClass("m-2")).toBeNull();
    expect(classifyBackgroundClass("flex")).toBeNull();
    expect(classifyBackgroundClass("grid")).toBeNull();
    expect(classifyBackgroundClass("rounded-lg")).toBeNull();
    expect(classifyBackgroundClass("shadow-md")).toBeNull();
    expect(classifyBackgroundClass("border-2")).toBeNull();
    expect(classifyBackgroundClass("hover:bg-red-500")).toBeNull();
    expect(classifyBackgroundClass("")).toBeNull();
  });

  it("should return null for invalid background classes", () => {
    expect(classifyBackgroundClass("bg-")).toBeNull();
    expect(classifyBackgroundClass("bg-invalid")).toBeNull();
    expect(classifyBackgroundClass("bg-unknown-class")).toBeNull();
  });
});

