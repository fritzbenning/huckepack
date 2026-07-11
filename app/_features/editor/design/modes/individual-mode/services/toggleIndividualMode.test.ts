import type { DesignPropertyConfig } from "@editor/design/registry";
import { executeAction } from "@shared/action";
import { waitForNextRender } from "@shared/utils/function";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toggleIndividualMode } from "./toggleIndividualMode";

vi.mock("@shared/action", () => ({
  executeAction: vi.fn(),
}));

vi.mock("@shared/utils/function", () => ({
  waitForNextRender: vi.fn(),
}));

vi.mock("@editor/design/utils", () => ({
  getCurrentFeatureClass: vi.fn(),
}));

describe("toggleIndividualMode", () => {
  const mockProjectId = "project123" as const;
  const mockFileId = "file123" as const;
  const mockAstPosition = 100;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createConfig = (): DesignPropertyConfig => ({
    features: {
      padding: {
        type: "numeric",
        classes: ["p-4"],
        prefix: "p",
      },
      paddingTop: {
        type: "numeric",
        classes: ["pt-4"],
        prefix: "pt",
      },
      paddingRight: {
        type: "numeric",
        classes: ["pr-4"],
        prefix: "pr",
      },
      paddingBottom: {
        type: "numeric",
        classes: ["pb-4"],
        prefix: "pb",
      },
      paddingLeft: {
        type: "numeric",
        classes: ["pl-4"],
        prefix: "pl",
      },
    },
  });

  it("should convert unified class to individual classes when toIndividualMode is true", async () => {
    const { getCurrentFeatureClass } = await import("@editor/design/shared/utils");
    vi.mocked(getCurrentFeatureClass).mockReturnValue("p-4");

    const config = createConfig();
    await toggleIndividualMode({
      toIndividualMode: true,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
      config,
      classTokens: ["p-4"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["pt-4", "pr-4", "pb-4", "pl-4"],
      classesToRemove: ["p-4"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should convert individual classes to unified class when toIndividualMode is false", async () => {
    const config = createConfig();
    await toggleIndividualMode({
      toIndividualMode: false,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
      config,
      classTokens: ["pt-4", "pr-4", "pb-4", "pl-4"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["p-4"],
      classesToRemove: ["pt-4", "pr-4", "pb-4", "pl-4"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not call executeAction when astPosition is null", async () => {
    const config = createConfig();
    await toggleIndividualMode({
      toIndividualMode: true,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop"],
      config,
      classTokens: ["p-4"],
      astPosition: null,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should handle unified class without suffix", async () => {
    const { getCurrentFeatureClass } = await import("@editor/design/shared/utils");
    vi.mocked(getCurrentFeatureClass).mockReturnValue("p");

    const config = createConfig();
    await toggleIndividualMode({
      toIndividualMode: true,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop"],
      config,
      classTokens: ["p"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["pt"],
      classesToRemove: ["p"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not call executeAction when no unified class found", async () => {
    const { getCurrentFeatureClass } = await import("@editor/design/shared/utils");
    vi.mocked(getCurrentFeatureClass).mockReturnValue("");

    const config = createConfig();
    await toggleIndividualMode({
      toIndividualMode: true,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop"],
      config,
      classTokens: ["other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should not call executeAction when no individual classes found", async () => {
    const config = createConfig();
    await toggleIndividualMode({
      toIndividualMode: false,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop", "paddingRight"],
      config,
      classTokens: ["other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should handle null classTokens", async () => {
    const { getCurrentFeatureClass } = await import("@editor/design/shared/utils");
    vi.mocked(getCurrentFeatureClass).mockReturnValue("");

    const config = createConfig();
    await toggleIndividualMode({
      toIndividualMode: true,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop"],
      config,
      classTokens: null,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should use custom extractSuffixFn when provided", async () => {
    const { getCurrentFeatureClass } = await import("@editor/design/shared/utils");
    vi.mocked(getCurrentFeatureClass).mockReturnValue("p-4");

    const customExtractSuffix = vi.fn(() => "custom");
    const config = createConfig();
    await toggleIndividualMode({
      toIndividualMode: true,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop"],
      config,
      classTokens: ["p-4"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
      extractSuffixFn: customExtractSuffix,
    });

    expect(customExtractSuffix).toHaveBeenCalledWith("p-4", "p");
  });

  it("should use custom applySuffixFn when provided", async () => {
    const { getCurrentFeatureClass } = await import("@editor/design/shared/utils");
    vi.mocked(getCurrentFeatureClass).mockReturnValue("p-4");

    const customApplySuffix = vi.fn((prefix, suffix) => `${prefix}-custom-${suffix}`);
    const config = createConfig();
    await toggleIndividualMode({
      toIndividualMode: true,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop"],
      config,
      classTokens: ["p-4"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
      applySuffixFn: customApplySuffix,
    });

    expect(customApplySuffix).toHaveBeenCalled();
    expect(executeAction).toHaveBeenCalledWith(
      "node.class.update",
      expect.objectContaining({
        classesToAdd: expect.arrayContaining([expect.stringContaining("custom")]),
      })
    );
  });

  it("should call waitForNextRender after executeAction", async () => {
    const { getCurrentFeatureClass } = await import("@editor/design/shared/utils");
    vi.mocked(getCurrentFeatureClass).mockReturnValue("p-4");

    const config = createConfig();
    await toggleIndividualMode({
      toIndividualMode: true,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop"],
      config,
      classTokens: ["p-4"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(waitForNextRender).toHaveBeenCalled();
  });

  it("should handle features without keys property", async () => {
    const { getCurrentFeatureClass } = await import("@editor/design/shared/utils");
    vi.mocked(getCurrentFeatureClass).mockReturnValue("padding-4");

    const config: DesignPropertyConfig = {
      features: {
        padding: {
          type: "numeric",
          prefix: "p",
          classes: ["padding-4"],
        },
        paddingTop: {
          type: "numeric",
          prefix: "pt",
          classes: ["paddingTop-4"],
        },
      },
    };

    await toggleIndividualMode({
      toIndividualMode: true,
      unifiedFeatureKey: "padding",
      individualFeatureKeys: ["paddingTop"],
      config,
      classTokens: ["padding-4"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalled();
  });
});
