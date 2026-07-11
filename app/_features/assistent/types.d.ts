export type ToolPartState = "input-streaming" | "input-available" | "output-available" | "output-error";

export interface ToolPart {
  type: string;
  toolCallId: string;
  state: ToolPartState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
}

export interface DynamicToolPart {
  type: "dynamic-tool";
  toolName: string;
  toolCallId: string;
  state: ToolPartState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
}
