export interface DprintFormatConfig {
  /** Maximum line width. Default: 80 */
  lineWidth?: number;
  /** Indent width in spaces. Default: 2 */
  indentWidth?: number;
  /** Use tabs instead of spaces. Default: false */
  useTabs?: boolean;
  /** New line kind. Default: "lf" */
  newLineKind?: "auto" | "lf" | "crlf" | "system";
  /** Plugin-specific configuration */
  pluginConfig?: Record<string, unknown>;
}

