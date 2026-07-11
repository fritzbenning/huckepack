import type { DesignPropertyConfig } from "@editor/design/registry";
import {
  convertTokenToCustomValue,
  convertTokenToScaleValue,
  getCurrentFeatureClass,
} from "@editor/design/shared/utils";
import type { TokenMap } from "@editor/design/values/token/types";
import { extractTokenValue } from "@editor/design/values/token/value/extractTokenValue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { transformClassToNumeric } from "./transformClassToNumeric";

vi.mock("@editor/design/shared/utils", async () => {
  const actual = await vi.importActual("@editor/design/shared/utils");
  return {
    ...actual,
    getCurrentFeatureClass: vi.fn(),
    convertTokenToCustomValue: vi.fn(),
    convertTokenToScaleValue: vi.fn(),
  };
});

vi.mock("@editor/design/values/token/value/extractTokenValue", () => ({
  extractTokenValue: vi.fn(),
}));

describe("transformClassToNumeric", () => {
  const tokenMap: TokenMap = {
    sm: 0.5,
    md: 1,
    lg: 1.5,
  };

  const config: DesignPropertyConfig = {
    features: {
      width: {
        type: "numeric",
        prefix: "w",
        classes: ["w-0", "w-1", "w-2"],
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should convert token class to custom value when targetUnit is px", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-sm");
    vi.mocked(extractTokenValue).mockReturnValue("sm");
    vi.mocked(convertTokenToCustomValue).mockReturnValue("w-[8px]");

    const result = transformClassToNumeric({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-sm"],
      tokenMap,
      targetUnit: "px",
    });

    expect(result).toBe("w-[8px]");
    expect(extractTokenValue).toHaveBeenCalledWith("w-sm", "w", tokenMap);
    expect(convertTokenToCustomValue).toHaveBeenCalledWith("sm", tokenMap, "w", "px");
    expect(convertTokenToScaleValue).not.toHaveBeenCalled();
  });

  it("should convert token class to scale value when targetUnit is scale", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-sm");
    vi.mocked(extractTokenValue).mockReturnValue("sm");
    vi.mocked(convertTokenToScaleValue).mockReturnValue("w-2");

    const result = transformClassToNumeric({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-sm"],
      tokenMap,
      targetUnit: "scale",
    });

    expect(result).toBe("w-2");
    expect(extractTokenValue).toHaveBeenCalledWith("w-sm", "w", tokenMap);
    expect(convertTokenToScaleValue).toHaveBeenCalledWith("sm", tokenMap, "w");
    expect(convertTokenToCustomValue).not.toHaveBeenCalled();
  });

  it("should not convert when class contains brackets", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-[8px]");

    const result = transformClassToNumeric({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-[8px]"],
      tokenMap,
      targetUnit: "px",
    });

    expect(result).toBeNull();
    expect(extractTokenValue).not.toHaveBeenCalled();
  });

  it("should not convert when token is undefined", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-2");
    vi.mocked(extractTokenValue).mockReturnValue(null);

    const result = transformClassToNumeric({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-2"],
      tokenMap,
      targetUnit: "px",
    });

    expect(result).toBeNull();
    expect(convertTokenToCustomValue).not.toHaveBeenCalled();
    expect(convertTokenToScaleValue).not.toHaveBeenCalled();
  });

  it("should handle prefix with trailing dash", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-sm");
    vi.mocked(extractTokenValue).mockReturnValue("sm");
    vi.mocked(convertTokenToCustomValue).mockReturnValue("w-[8px]");

    const result = transformClassToNumeric({
      config,
      featurePrefix: "width",
      prefix: "w-",
      classTokens: ["w-sm"],
      tokenMap,
      targetUnit: "px",
    });

    expect(result).toBe("w-[8px]");
    expect(extractTokenValue).toHaveBeenCalledWith("w-sm", "w", tokenMap);
  });

  it("should return null when no matching classes", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue(null);

    const result = transformClassToNumeric({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["h-4"],
      tokenMap,
      targetUnit: "px",
    });

    expect(result).toBeNull();
  });

  it("should handle different target units", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-sm");
    vi.mocked(extractTokenValue).mockReturnValue("sm");
    vi.mocked(convertTokenToCustomValue).mockReturnValue("w-[0.5rem]");

    const result = transformClassToNumeric({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-sm"],
      tokenMap,
      targetUnit: "rem",
    });

    expect(result).toBe("w-[0.5rem]");
    expect(convertTokenToCustomValue).toHaveBeenCalledWith("sm", tokenMap, "w", "rem");
  });
});
