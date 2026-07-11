import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { DesignPropertyConfig } from "@editor/design/registry";
import { deduplicateClasses, getCurrentFeatureClass, resolveShorthandClasses } from "@editor/design/shared/utils";
import { executeAction } from "@shared/action";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeDesignProperty } from "./removeDesignProperty";

vi.mock("@shared/action", () => ({
  executeAction: vi.fn(),
}));

vi.mock("@editor/design/shared/utils", () => ({
  getCurrentFeatureClass: vi.fn((config, classTokens, featureKey) => {
    const feature = config.features[featureKey];
    if (!feature) return null;

    if (feature.type === "enum" || feature.type === "toggle") {
      return classTokens.find((c: string) => feature.classes.includes(c)) || null;
    }
    if (feature.type === "numeric" || feature.type === "percentValue") {
      const prefix = feature.prefixes?.[0];
      return classTokens.find((c: string) => c.startsWith(`${prefix}-`)) || null;
    }
    return null;
  }),
  resolveShorthandClasses: vi.fn(() => ({
    shorthandsToDelete: [],
    shorthandsToReplace: [],
  })),
  deduplicateClasses: vi.fn((arr1: string[], arr2: string[] = []) => {
    return Array.from(new Set([...arr1, ...arr2]));
  }),
}));

describe("removeDesignProperty", () => {
  const mockProjectId = "project123" as const;
  const mockFileId = "file123" as const;
  const mockAstPosition = 100;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createStringLiteralClasses = (tokens: string[]): StringLiteralClasses => ({
    type: "StringLiteral",
    classTokens: tokens,
    value: tokens.join(" "),
    span: { start: 0, end: 0, ctxt: 0 },
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
    },
  });

  it("should not call executeAction when astPosition is null", async () => {
    const config = createConfig();
    const classes = createStringLiteralClasses(["flex-row"]);

    await removeDesignProperty({
      config,
      classes,
      astPosition: null,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should not call executeAction when classes is null", async () => {
    const config = createConfig();

    await removeDesignProperty({
      config,
      classes: null,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should remove exact matching classes", async () => {
    const config = createConfig();
    const classes = createStringLiteralClasses(["flex-row", "other-class"]);

    vi.mocked(getCurrentFeatureClass).mockImplementation((_cfg, tokens, key) => {
      if (key === "flexDirection" && tokens?.includes("flex-row")) {
        return "flex-row";
      }
      return null;
    });

    vi.mocked(resolveShorthandClasses).mockReturnValue({
      shorthandsToDelete: [],
      shorthandsToReplace: [],
    });

    await removeDesignProperty({
      config,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: [],
      classesToRemove: expect.arrayContaining(["flex-row"]),
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should remove prefix matching classes", async () => {
    const config = createConfig();
    const classes = createStringLiteralClasses(["w-10", "other-class"]);

    vi.mocked(getCurrentFeatureClass).mockImplementation((_cfg, tokens, key) => {
      if (key === "width" && tokens?.includes("w-10")) {
        return "w-10";
      }
      return null;
    });

    vi.mocked(resolveShorthandClasses).mockReturnValue({
      shorthandsToDelete: [],
      shorthandsToReplace: [],
    });

    await removeDesignProperty({
      config,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: [],
      classesToRemove: expect.arrayContaining(["w-10"]),
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should handle both exact and prefix matches", async () => {
    const config = createConfig();
    const classes = createStringLiteralClasses(["flex-row", "w-10", "other-class"]);

    vi.mocked(getCurrentFeatureClass).mockImplementation((_cfg, tokens, key) => {
      if (key === "flexDirection" && tokens?.includes("flex-row")) {
        return "flex-row";
      }
      if (key === "width" && tokens?.includes("w-10")) {
        return "w-10";
      }
      return null;
    });

    vi.mocked(resolveShorthandClasses).mockReturnValue({
      shorthandsToDelete: [],
      shorthandsToReplace: [],
    });

    await removeDesignProperty({
      config,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: [],
      classesToRemove: expect.arrayContaining(["flex-row", "w-10"]),
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not call executeAction when no classes match", async () => {
    const config = createConfig();
    const classes = createStringLiteralClasses(["other-class", "another-class"]);

    vi.mocked(getCurrentFeatureClass).mockReturnValue(null);

    await removeDesignProperty({
      config,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should handle TemplateLiteral classes", async () => {
    const config = createConfig();
    const classes: TemplateLiteralClasses = {
      type: "TemplateLiteral",
      classTokens: ["flex-row"],
      segments: [
        {
          kind: "quasi",
          classTokens: ["flex-row"],
          raw: "flex-row",
          tail: true,
          span: { start: 0, end: 0, ctxt: 0 },
        },
      ],
      span: { start: 0, end: 0, ctxt: 0 },
    };

    vi.mocked(getCurrentFeatureClass).mockImplementation((_cfg, tokens, key) => {
      if (key === "flexDirection" && tokens?.includes("flex-row")) {
        return "flex-row";
      }
      return null;
    });

    vi.mocked(resolveShorthandClasses).mockReturnValue({
      shorthandsToDelete: [],
      shorthandsToReplace: [],
    });

    await removeDesignProperty({
      config,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalled();
  });

  it("should deduplicate classes to remove", async () => {
    const config = createConfig();
    const classes = createStringLiteralClasses(["flex-row", "flex-row", "w-10"]);

    vi.mocked(getCurrentFeatureClass).mockImplementation((_cfg, tokens, key) => {
      if (key === "flexDirection" && tokens?.includes("flex-row")) {
        return "flex-row";
      }
      if (key === "width" && tokens?.includes("w-10")) {
        return "w-10";
      }
      return null;
    });

    vi.mocked(resolveShorthandClasses).mockReturnValue({
      shorthandsToDelete: [],
      shorthandsToReplace: [],
    });

    vi.mocked(deduplicateClasses).mockImplementation((arr1: string[], arr2: string[] = []) => {
      return Array.from(new Set([...arr1, ...arr2]));
    });

    await removeDesignProperty({
      config,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith(
      "node.class.update",
      expect.objectContaining({
        classesToRemove: expect.any(Array),
      })
    );

    const call = vi.mocked(executeAction).mock.calls[0];
    const classesToRemove = (call[1] as { classesToRemove: string[] }).classesToRemove;
    expect(new Set(classesToRemove).size).toBe(classesToRemove.length);
  });
});
