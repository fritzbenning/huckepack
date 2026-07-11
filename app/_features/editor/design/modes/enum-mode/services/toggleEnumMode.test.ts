import type { DesignPropertyConfig } from "@editor/design/registry";
import { executeAction } from "@shared/action";
import { waitForNextRender } from "@shared/utils/function";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toggleEnumMode } from "./toggleEnumMode";

vi.mock("@shared/action", () => ({
  executeAction: vi.fn(),
}));

vi.mock("@shared/utils/function", () => ({
  waitForNextRender: vi.fn(),
}));

describe("toggleEnumMode", () => {
  const mockProjectId = "project123" as const;
  const mockFileId = "file123" as const;
  const mockAstPosition = 100;

  const createConfig = (): DesignPropertyConfig => ({
    features: {
      width: {
        type: "numeric",
        prefix: "w",
        classes: ["w-0", "w-10", "w-auto", "w-full", "w-screen"],
        defaultUnit: "scale",
      },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should convert non-enum class to enum when toEnumMode is true", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: true,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-10", "other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["w-auto"],
      classesToRemove: ["w-10"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not convert when class is already an enum", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: true,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-auto", "other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should convert enum class to scale when toEnumMode is false and numericTargetValue is scale", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: false,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-auto", "other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
      numericTargetValue: { value: 50, unit: "scale" },
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["w-50"],
      classesToRemove: ["w-auto"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should convert enum class to 0 when toEnumMode is false and numericTargetValue is px", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: false,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-auto", "other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
      numericTargetValue: { value: 0, unit: "px" },
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["w-0"],
      classesToRemove: ["w-auto"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should convert enum class to 0 when toEnumMode is false and numericTargetValue is rem", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: false,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-auto", "other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
      numericTargetValue: { value: 0, unit: "rem" },
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["w-0"],
      classesToRemove: ["w-auto"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not call executeAction when astPosition is null", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: true,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-10"],
      astPosition: null,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should not call executeAction when no matching class found for toEnumMode true", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: true,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["h-10", "other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should not call executeAction when no enum class found for toEnumMode false", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: false,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-10", "other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should handle prefix with trailing dash", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: true,
      config,
      featurePrefix: "width",
      prefix: "w-",
      classTokens: ["w-10"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["w--auto"],
      classesToRemove: ["w-10"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should handle null classTokens", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: true,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: null,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should handle empty classTokens array", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: true,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: [],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should call waitForNextRender after executeAction", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: true,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-10"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(waitForNextRender).toHaveBeenCalled();
  });

  it("should not call waitForNextRender when executeAction is not called", async () => {
    const config = createConfig();
    await toggleEnumMode({
      toEnumMode: true,
      config,
      featurePrefix: "width",
      prefix: "w",
      classTokens: ["w-auto"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(waitForNextRender).not.toHaveBeenCalled();
  });
});
