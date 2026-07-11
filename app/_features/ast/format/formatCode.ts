import type { FormatRequest, GlobalConfiguration } from "@dprint/formatter";
import { initDprint } from "@hooks/application/useDprint";
import { DEFAULT_DPRINT_CONFIG } from "./constants";
import type { DprintFormatConfig } from "./types";

export async function formatCode(code: string, formatConfig?: DprintFormatConfig): Promise<string> {
  try {
    const tsFormatter = await initDprint();

    // Build the final configuration - merge with defaults
    const globalConfig: GlobalConfiguration = {
      lineWidth: formatConfig?.lineWidth ?? DEFAULT_DPRINT_CONFIG.lineWidth,
      indentWidth: formatConfig?.indentWidth ?? DEFAULT_DPRINT_CONFIG.indentWidth,
      useTabs: formatConfig?.useTabs ?? DEFAULT_DPRINT_CONFIG.useTabs,
      newLineKind: formatConfig?.newLineKind ?? DEFAULT_DPRINT_CONFIG.newLineKind,
    };

    const pluginConfig = {
      semiColons: "asi",
      ...formatConfig?.pluginConfig,
    };

    // Apply configuration to the formatter
    tsFormatter.setConfig(globalConfig, pluginConfig);

    // Format the code
    const formatRequest: FormatRequest = {
      filePath: "file.tsx",
      fileText: code,
      // Only include plugin-specific config in overrideConfig if needed
      overrideConfig: formatConfig?.pluginConfig,
    };

    const formattedCode = tsFormatter.formatText(formatRequest);

    return formattedCode;
  } catch (error) {
    console.warn("Failed to format code with dprint, returning unformatted code:", error);
    // Return unformatted code if formatting fails
    return code;
  }
}
