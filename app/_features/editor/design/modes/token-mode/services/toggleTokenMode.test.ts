import type { DesignPropertyConfig } from "@editor/design/registry";
import type { TokenMap } from "@editor/design/values/token/types";
import { executeAction } from "@shared/action";
import { waitForNextRender } from "@shared/utils/function";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toggleTokenMode } from "./toggleTokenMode";

vi.mock("@shared/action", () => ({
  executeAction: vi.fn(),
}));

vi.mock("@shared/utils/function", () => ({
  waitForNextRender: vi.fn(),
}));

vi.mock("../transformers/transformClassToToken", () => ({
  transformClassToToken: vi.fn(),
}));

vi.mock("../transformers/transformClassToNumeric", () => ({
  transformClassToNumeric: vi.fn(),
}));

describe("toggleTokenMode", () => {
  const mockProjectId = "project123" as const;
  const mockFileId = "file123" as const;
  const mockAstPosition = 100;
  const mockConfig: DesignPropertyConfig = {
    features: {
      width: {},
    },
  };
  const tokenMap: TokenMap = {
    sm: 0.5,
    md: 1,
    lg: 1.5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should convert custom value to token when toTokenMode is true", async () => {
    const { transformClassToToken } = await import("../transformers/transformClassToToken");
    vi.mocked(transformClassToToken).mockReturnValue("w-sm");

    await toggleTokenMode({
      toTokenMode: true,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: ["w-[8px]"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(transformClassToToken).toHaveBeenCalledWith({
      prefix: "w",
      tokens: ["w-[8px]"],
      tokenMap,
    });
    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["w-sm"],
      classesToRemove: ["w-[8px]"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should convert scale value to token when toTokenMode is true and no custom value", async () => {
    const { transformClassToToken } = await import("../transformers/transformClassToToken");
    vi.mocked(transformClassToToken).mockReturnValue("w-sm");

    await toggleTokenMode({
      toTokenMode: true,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: ["w-2"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(transformClassToToken).toHaveBeenCalledWith({
      prefix: "w",
      tokens: ["w-2"],
      tokenMap,
    });
    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["w-sm"],
      classesToRemove: ["w-2"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not convert when token already exists", async () => {
    const { transformClassToToken } = await import("../transformers/transformClassToToken");
    vi.mocked(transformClassToToken).mockReturnValue(null);

    await toggleTokenMode({
      toTokenMode: true,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: ["w-sm"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(transformClassToToken).toHaveBeenCalledWith({
      prefix: "w",
      tokens: ["w-sm"],
      tokenMap,
    });
    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should convert token to custom value when toTokenMode is false", async () => {
    const { transformClassToNumeric } = await import("../transformers/transformClassToNumeric");
    vi.mocked(transformClassToNumeric).mockReturnValue("w-[8px]");

    await toggleTokenMode({
      toTokenMode: false,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: ["w-sm"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
      numericTargetUnit: "px",
    });

    expect(transformClassToNumeric).toHaveBeenCalledWith({
      prefix: "w",
      tokens: ["w-sm"],
      tokenMap,
      targetUnit: "px",
    });
    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["w-[8px]"],
      classesToRemove: ["w-sm"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not convert when class contains brackets and toTokenMode is false", async () => {
    const { transformClassToNumeric } = await import("../transformers/transformClassToNumeric");
    vi.mocked(transformClassToNumeric).mockReturnValue(null);

    await toggleTokenMode({
      toTokenMode: false,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: ["w-[8px]"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(transformClassToNumeric).toHaveBeenCalledWith({
      prefix: "w",
      tokens: ["w-[8px]"],
      tokenMap,
      targetUnit: "px",
    });
    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should not call executeAction when astPosition is null", async () => {
    await toggleTokenMode({
      toTokenMode: true,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: ["w-[8px]"],
      astPosition: null,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should handle single prefix", async () => {
    const { transformClassToToken } = await import("../transformers/transformClassToToken");
    vi.mocked(transformClassToToken).mockReturnValue("w-sm");

    await toggleTokenMode({
      toTokenMode: true,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: ["w-[8px]"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(transformClassToToken).toHaveBeenCalledWith({
      prefix: "w",
      tokens: ["w-[8px]"],
      tokenMap,
    });
    expect(executeAction).toHaveBeenCalled();
  });

  it("should handle prefix with trailing dash", async () => {
    const { transformClassToToken } = await import("../transformers/transformClassToToken");
    vi.mocked(transformClassToToken).mockReturnValue("w-sm");

    await toggleTokenMode({
      toTokenMode: true,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w-",
      tokenMap,
      classTokens: ["w-[8px]"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(transformClassToToken).toHaveBeenCalledWith({
      prefix: "w-",
      tokens: ["w-[8px]"],
      tokenMap,
    });
    expect(executeAction).toHaveBeenCalled();
  });

  it("should handle null classTokens", async () => {
    await toggleTokenMode({
      toTokenMode: true,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: null,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should handle empty classTokens array", async () => {
    await toggleTokenMode({
      toTokenMode: true,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: [],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should call waitForNextRender after executeAction", async () => {
    const { transformClassToToken } = await import("../transformers/transformClassToToken");
    vi.mocked(transformClassToToken).mockReturnValue("w-sm");

    await toggleTokenMode({
      toTokenMode: true,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: ["w-[8px]"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(waitForNextRender).toHaveBeenCalled();
  });

  it("should use numericTargetUnit when converting token to custom value", async () => {
    const { transformClassToNumeric } = await import("../transformers/transformClassToNumeric");
    vi.mocked(transformClassToNumeric).mockReturnValue("w-[0.5rem]");

    await toggleTokenMode({
      toTokenMode: false,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: ["w-sm"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
      numericTargetUnit: "rem",
    });

    expect(transformClassToNumeric).toHaveBeenCalledWith({
      prefix: "w",
      tokens: ["w-sm"],
      tokenMap,
      targetUnit: "rem",
    });
  });

  it("should handle prefix matching exact prefix", async () => {
    const { transformClassToNumeric } = await import("../transformers/transformClassToNumeric");
    vi.mocked(transformClassToNumeric).mockReturnValue("w-[8px]");

    await toggleTokenMode({
      toTokenMode: false,
      config: mockConfig,
      featurePrefix: "width",
      prefix: "w",
      tokenMap,
      classTokens: ["w"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(transformClassToNumeric).toHaveBeenCalledWith({
      prefix: "w",
      tokens: ["w"],
      tokenMap,
      targetUnit: "px",
    });
    expect(executeAction).toHaveBeenCalled();
  });
});
