import type { Id } from "../_generated/dataModel";

export type AssistMessage = {
  role: "user" | "assistant" | "system";
  content?: string | Array<{ type: string; text?: string }>;
  parts?: Array<{ type: string; text?: string }>;
  id?: string;
};

export type AssistRequestBody = {
  messages: Array<AssistMessage>;
  projectId: Id<"projects">;
  currentFileId?: Id<"files">;
  fileId?: Id<"files">;
  tailwindTheme?: string;
  model?: string;
  [key: string]: unknown;
};
