import type { DesignPropertyConfig } from "@editor/design/registry";
import {
  convertCustomValueToToken,
  convertScaleValueToToken,
  getCurrentFeatureClass,
} from "@editor/design/shared/utils";
import { createTokenClass } from "@editor/design/values/token/classes/create/createTokenClass";
import type { TokenMap } from "@editor/design/values/token/types";
import { extractTokenValue } from "@editor/design/values/token/value/extractTokenValue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { transformClassToToken } from "./transformClassToToken";

vi.mock("@editor/design/shared/utils", async () => {
  const actual = await vi.importActual("@editor/design/shared/utils");
  return {
    ...actual,
    getCurrentFeatureClass: vi.fn(),
    convertCustomValueToToken: vi.fn(),
    convertScaleValueToToken: vi.fn(),
  };
});

vi.mock("@editor/design/values/token/value/extractTokenValue", () => ({
  extractTokenValue: vi.fn(),
}));

vi.mock("@editor/design/values/token/classes/create/createTokenClass", () => ({
  createTokenClass: vi.fn(),
}));

describe("transformClassToToken", () => {
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

  it("should convert custom value class to token class", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-[8px]");
    vi.mocked(convertCustomValueToToken).mockReturnValue("sm");
    vi.mocked(createTokenClass).mockReturnValue("w-sm");

    const result = transformClassToToken({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-[8px]"],
      tokenMap,
    });

    expect(result).toBe("w-sm");
    expect(convertCustomValueToToken).toHaveBeenCalledWith("w-[8px]", tokenMap, "w");
    expect(createTokenClass).toHaveBeenCalledWith("sm", "w", tokenMap);
  });

  it("should convert scale value class to token class when no existing token", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-2");
    vi.mocked(extractTokenValue).mockReturnValue(null);
    vi.mocked(convertScaleValueToToken).mockReturnValue("sm");
    vi.mocked(createTokenClass).mockReturnValue("w-sm");

    const result = transformClassToToken({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-2"],
      tokenMap,
    });

    expect(result).toBe("w-sm");
    expect(extractTokenValue).toHaveBeenCalledWith("w-2", "w", tokenMap);
    expect(convertScaleValueToToken).toHaveBeenCalledWith("w-2", tokenMap, "w");
    expect(createTokenClass).toHaveBeenCalledWith("sm", "w", tokenMap);
  });

  it("should not convert when token already exists", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-sm");
    vi.mocked(extractTokenValue).mockReturnValue("sm");

    const result = transformClassToToken({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-sm"],
      tokenMap,
    });

    expect(result).toBeNull();
    expect(convertScaleValueToToken).not.toHaveBeenCalled();
  });

  it("should not convert when custom value conversion returns undefined", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-[8px]");
    vi.mocked(convertCustomValueToToken).mockReturnValue(undefined);

    const result = transformClassToToken({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-[8px]"],
      tokenMap,
    });

    expect(result).toBeNull();
    expect(createTokenClass).not.toHaveBeenCalled();
  });

  it("should not convert when scale value conversion returns undefined", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-2");
    vi.mocked(extractTokenValue).mockReturnValue(null);
    vi.mocked(convertScaleValueToToken).mockReturnValue(undefined);

    const result = transformClassToToken({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-2"],
      tokenMap,
    });

    expect(result).toBeNull();
    expect(createTokenClass).not.toHaveBeenCalled();
  });

  it("should handle prefix with trailing dash", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue("w-[8px]");
    vi.mocked(convertCustomValueToToken).mockReturnValue("sm");
    vi.mocked(createTokenClass).mockReturnValue("w-sm");

    const result = transformClassToToken({
      config,
      featurePrefix: "width",
      prefix: "w-",
      classTokens: ["w-[8px]"],
      tokenMap,
    });

    expect(result).toBe("w-sm");
    expect(convertCustomValueToToken).toHaveBeenCalledWith("w-[8px]", tokenMap, "w");
  });

  it("should return null when no matching classes", () => {
    vi.mocked(getCurrentFeatureClass).mockReturnValue(null);

    const result = transformClassToToken({
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["h-4"],
      tokenMap,
    });

    expect(result).toBeNull();
  });
});
