import type { DesignPropertyConfig } from "@editor/design/registry";
import { executeAction } from "@shared/action";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toggleDesignPropertyClasses } from "./toggleDesignPropertyClasses";

vi.mock("@shared/action", () => ({
  executeAction: vi.fn(),
}));

vi.mock("@editor/design/property-types/numeric", () => ({
  getNumericClassName: vi.fn((feature, featurePrefix, targetClass) => {
    if (feature.type === "numeric" && !targetClass.includes("-")) {
      return `${featurePrefix}-${targetClass}`;
    }
    return targetClass;
  }),
  isNumericFeature: vi.fn((feature) => feature.type === "numeric"),
}));

describe("toggleDesignPropertyClasses", () => {
  const mockProjectId = "project123" as const;
  const mockFileId = "file123" as const;
  const mockAstPosition = 100;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createConfig = (): DesignPropertyConfig => ({
    features: {
      flexDirection: {
        type: "enum",
        classes: ["flex-row", "flex-col"],
      },
      width: {
        type: "numeric",
        classes: ["w-0", "w-10"],
        prefixes: ["w"],
      },
      justifyBetween: {
        type: "toggle",
        classes: ["justify-start", "justify-between"],
      },
    },
  });

  it("should not call executeAction when astPosition is null", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "flexDirection",
      classTokens: ["flex-row"],
      astPosition: null,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should not call executeAction when feature does not exist", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "nonExistent",
      classTokens: ["any-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should toggle from first class to second class", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "flexDirection",
      classTokens: ["flex-row"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith(
      "node.class.update",
      expect.objectContaining({
        classesToRemove: ["flex-row"],
        nodeStart: mockAstPosition,
        projectId: mockProjectId,
        fileId: mockFileId,
      })
    );
  });

  it("should toggle from second class to first class", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "flexDirection",
      classTokens: ["flex-col"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["flex-row"],
      classesToRemove: ["flex-col"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should toggle from inactive to active", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "flexDirection",
      classTokens: ["other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["flex-col"],
      classesToRemove: [],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should handle numeric feature", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "width",
      classTokens: ["w-0"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalled();
  });

  it("should remove conflicting justify classes for justifyBetween", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "justifyBetween",
      classTokens: ["justify-center", "other-class"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["justify-between"],
      classesToRemove: expect.arrayContaining(["justify-center"]),
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not add justify-start (browser default)", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "justifyBetween",
      classTokens: ["justify-between"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith(
      "node.class.update",
      expect.objectContaining({
        classesToAdd: expect.not.arrayContaining(["justify-start"]),
      })
    );
  });

  it("should not add flex-nowrap (browser default)", async () => {
    const config: DesignPropertyConfig = {
      features: {
        flexWrap: {
          type: "toggle",
          classes: ["flex-wrap", "flex-nowrap"],
        },
      },
    };

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "flexWrap",
      classTokens: ["flex-wrap"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith(
      "node.class.update",
      expect.objectContaining({
        classesToAdd: expect.not.arrayContaining(["flex-nowrap"]),
      })
    );
  });

  it("should handle null classTokens", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "flexDirection",
      classTokens: null,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalled();
  });

  it("should handle empty classTokens array", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "flexDirection",
      classTokens: [],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalled();
  });

  it("should not add class if it already exists", async () => {
    const config = createConfig();

    await toggleDesignPropertyClasses({
      config,
      featurePrefix: "flexDirection",
      classTokens: ["flex-col"],
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith(
      "node.class.update",
      expect.objectContaining({
        classesToAdd: expect.not.arrayContaining(["flex-col"]),
      })
    );
  });
});
