import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { DesignPropertyConfig } from "@editor/design/registry";
import { executeAction } from "@shared/action";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DropdownValue } from "../types";
import { addDesignRule } from "./addDesignRule";

vi.mock("@shared/action", () => ({
  executeAction: vi.fn(),
}));

describe("addDesignRule", () => {
  const mockProjectId = "project123" as const;
  const mockFileId = "file123" as const;
  const mockAstPosition = 100;
  const mockConfig: DesignPropertyConfig = { features: {} };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add class when not present and remove sibling classes", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: ["absolute", "fixed"],
    };
    const classes = {
      type: "StringLiteral",
      classTokens: ["absolute", "other-class"],
    } as StringLiteralClasses;

    await addDesignRule({
      value,
      config: mockConfig,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["relative"],
      classesToRemove: ["absolute"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not add class when already present but remove sibling classes", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: ["absolute", "fixed"],
    };
    const classes = {
      type: "StringLiteral",
      classTokens: ["relative", "absolute", "other-class"],
    } as StringLiteralClasses;

    await addDesignRule({
      value,
      config: mockConfig,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: [],
      classesToRemove: ["absolute"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should remove multiple sibling classes", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: ["absolute", "fixed", "sticky"],
    };
    const classes = {
      type: "StringLiteral",
      classTokens: ["absolute", "fixed", "other-class"],
    } as StringLiteralClasses;

    await addDesignRule({
      value,
      config: mockConfig,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["relative"],
      classesToRemove: ["absolute", "fixed"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not call executeAction when astPosition is null", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: [],
    };
    const classes = {
      type: "StringLiteral",
      classTokens: [],
    } as unknown as StringLiteralClasses;

    await addDesignRule({
      value,
      classes,
      astPosition: null,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should handle empty sibling classes", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: [],
    };
    const classes = {
      type: "StringLiteral",
      classTokens: ["other-class"],
    } as StringLiteralClasses;

    await addDesignRule({
      value,
      config: mockConfig,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["relative"],
      classesToRemove: [],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should handle null classes", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: ["absolute"],
    };

    await addDesignRule({
      value,
      classes: null,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["relative"],
      classesToRemove: [],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should handle template literal classes", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: ["absolute"],
    };
    const classes = {
      type: "TemplateLiteral",
      classTokens: ["absolute", "other-class"],
    } as TemplateLiteralClasses;

    await addDesignRule({
      value,
      config: mockConfig,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["relative"],
      classesToRemove: ["absolute"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should not call executeAction when no classes to add or remove", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: ["absolute"],
    };
    const classes = {
      type: "StringLiteral",
      classTokens: ["relative"],
    } as StringLiteralClasses;

    await addDesignRule({
      value,
      config: mockConfig,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });

  it("should handle classes with classTokens null", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: ["absolute"],
    };
    const classes = {
      type: "StringLiteral",
      classTokens: null,
    } as unknown as StringLiteralClasses;

    await addDesignRule({
      value,
      config: mockConfig,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["relative"],
      classesToRemove: [],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should only remove sibling classes that are present", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: ["absolute", "fixed", "sticky"],
    };
    const classes = {
      type: "StringLiteral",
      classTokens: ["absolute", "other-class"],
    } as StringLiteralClasses;

    await addDesignRule({
      value,
      config: mockConfig,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).toHaveBeenCalledWith("node.class.update", {
      classesToAdd: ["relative"],
      classesToRemove: ["absolute"],
      nodeStart: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });
  });

  it("should handle case where class is already present and no siblings to remove", async () => {
    const value: DropdownValue = {
      classToAdd: "relative",
      label: "Relative",
      siblingClasses: ["absolute"],
    };
    const classes = {
      type: "StringLiteral",
      classTokens: ["relative", "other-class"],
    } as StringLiteralClasses;

    await addDesignRule({
      value,
      config: mockConfig,
      classes,
      astPosition: mockAstPosition,
      projectId: mockProjectId,
      fileId: mockFileId,
    });

    expect(executeAction).not.toHaveBeenCalled();
  });
});
