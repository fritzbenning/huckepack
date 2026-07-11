import type { Formatter } from "@dprint/formatter";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { formatCode } from "./formatCode";

// Mock the dprint hook
vi.mock("@hooks/application/useDprint", () => ({
  initDprint: vi.fn(),
}));

describe("formatCode", () => {
  const mockFormatter = {
    setConfig: vi.fn(),
    formatText: vi.fn(),
    getConfigDiagnostics: vi.fn(),
    getResolvedConfig: vi.fn(),
    getPluginInfo: vi.fn(),
    getFileMatchingInfo: vi.fn(),
    getLicenseText: vi.fn(),
  } satisfies Formatter;

  beforeEach(async () => {
    vi.resetAllMocks();
    const { initDprint } = vi.mocked(await import("@hooks/application/useDprint"));
    initDprint.mockResolvedValue(mockFormatter);
  });

  it("should format code with default configuration", async () => {
    const inputCode = "const x=1;const y=2;";
    const expectedOutput = "const x = 1\nconst y = 2\n";

    mockFormatter.formatText.mockReturnValue(expectedOutput);

    const result = await formatCode(inputCode);

    expect(result).toBe(expectedOutput);
    expect(mockFormatter.setConfig).toHaveBeenCalledWith(
      {
        lineWidth: 120,
        indentWidth: 2,
        useTabs: false,
        newLineKind: "lf",
      },
      {
        semiColons: "asi",
      }
    );
    expect(mockFormatter.formatText).toHaveBeenCalledWith({
      filePath: "file.tsx",
      fileText: inputCode,
      overrideConfig: undefined,
    });
  });

  it("should format code with custom configuration", async () => {
    const inputCode = "function test(){return 42;}";
    const expectedOutput = "function test() {\n    return 42\n}\n";
    const customConfig = {
      lineWidth: 80,
      indentWidth: 4,
      useTabs: true,
      newLineKind: "crlf" as const,
      pluginConfig: {
        semiColons: "always",
        quoteStyle: "alwaysDouble",
      },
    };

    mockFormatter.formatText.mockReturnValue(expectedOutput);

    const result = await formatCode(inputCode, customConfig);

    expect(result).toBe(expectedOutput);
    expect(mockFormatter.setConfig).toHaveBeenCalledWith(
      {
        lineWidth: 80,
        indentWidth: 4,
        useTabs: true,
        newLineKind: "crlf",
      },
      {
        semiColons: "always",
        quoteStyle: "alwaysDouble",
      }
    );
  });

  it("should handle partial custom configuration", async () => {
    const inputCode = "const arr=[1,2,3];";
    const expectedOutput = "const arr = [1, 2, 3]\n";
    const partialConfig = {
      lineWidth: 100,
      pluginConfig: {
        quoteStyle: "alwaysSingle",
      },
    };

    mockFormatter.formatText.mockReturnValue(expectedOutput);

    const result = await formatCode(inputCode, partialConfig);

    expect(result).toBe(expectedOutput);
    expect(mockFormatter.setConfig).toHaveBeenCalledWith(
      {
        lineWidth: 100,
        indentWidth: 2, // default
        useTabs: false, // default
        newLineKind: "lf", // default
      },
      {
        semiColons: "asi",
        quoteStyle: "alwaysSingle",
      }
    );
  });

  it("should return unformatted code when formatting fails", async () => {
    const inputCode = "const x = 1;";
    const error = new Error("Formatting failed");

    mockFormatter.formatText.mockImplementation(() => {
      throw error;
    });

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await formatCode(inputCode);

    expect(result).toBe(inputCode);
    expect(consoleSpy).toHaveBeenCalledWith("Failed to format code with dprint, returning unformatted code:", error);

    consoleSpy.mockRestore();
  });

  it("should return unformatted code when dprint initialization fails", async () => {
    const inputCode = "const x = 1;";
    const error = new Error("Init failed");

    const { initDprint } = vi.mocked(await import("@hooks/application/useDprint"));
    initDprint.mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await formatCode(inputCode);

    expect(result).toBe(inputCode);
    expect(consoleSpy).toHaveBeenCalledWith("Failed to format code with dprint, returning unformatted code:", error);

    consoleSpy.mockRestore();
  });

  it("should handle empty code input", async () => {
    const inputCode = "";
    const expectedOutput = "";

    mockFormatter.formatText.mockReturnValue(expectedOutput);

    const result = await formatCode(inputCode);

    expect(result).toBe(expectedOutput);
    expect(mockFormatter.formatText).toHaveBeenCalledWith({
      filePath: "file.tsx",
      fileText: inputCode,
      overrideConfig: undefined,
    });
  });

  it("should handle complex TypeScript code", async () => {
    const inputCode = "interface User{name:string;age:number;}const user:User={name:'John',age:30};";
    const expectedOutput =
      "interface User {\n  name: string\n  age: number\n}\n\nconst user: User = {\n  name: 'John',\n  age: 30,\n}\n";

    mockFormatter.formatText.mockReturnValue(expectedOutput);

    const result = await formatCode(inputCode);

    expect(result).toBe(expectedOutput);
  });

  it("should handle JSX code", async () => {
    const inputCode = "const Component=()=><div><span>Hello</span></div>;";
    const expectedOutput = "const Component = () => (\n  <div>\n    <span>Hello</span>\n  </div>\n)\n";

    mockFormatter.formatText.mockReturnValue(expectedOutput);

    const result = await formatCode(inputCode);

    expect(result).toBe(expectedOutput);
  });

  it("should pass plugin config to overrideConfig", async () => {
    const inputCode = "const x = 1;";
    const config = {
      pluginConfig: {
        semiColons: "always",
        trailingCommas: "always",
      },
    };

    mockFormatter.formatText.mockReturnValue("const x = 1;\n");

    await formatCode(inputCode, config);

    expect(mockFormatter.formatText).toHaveBeenCalledWith({
      filePath: "file.tsx",
      fileText: inputCode,
      overrideConfig: {
        semiColons: "always",
        trailingCommas: "always",
      },
    });
  });
});
