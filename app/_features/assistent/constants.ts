export const DEFAULT_THREAD_TITLE = "New Thread";

export type AIModel =
  | "google/gemini-3-flash-preview"
  | "anthropic/claude-sonnet-4.5"
  | "anthropic/claude-haiku-4.5"
  | "z-ai/glm-4.7"
  | "z-ai/glm-4.7-flash"
  | "x-ai/grok-code-fast-1"
  | "minimax/minimax-m2.1"
  | "mistralai/devstral-2512:free"
  | "deepseek/deepseek-r1-0528:free";

export const models = [
  { value: "google/gemini-3-flash-preview", label: "gemini-3-flash" },
  { value: "anthropic/claude-sonnet-4.5", label: "claude-4.5-sonnet" },
  { value: "anthropic/claude-haiku-4.5", label: "claude-4.5-haiku" },
  { value: "z-ai/glm-4.7", label: "glm-4.7" },
  { value: "z-ai/glm-4.7-flash", label: "glm-4.7-flash" },
  { value: "x-ai/grok-code-fast-1", label: "grok-code-fast-1" },
  { value: "minimax/minimax-m2.1", label: "minimax-m2.1" },
  { value: "mistralai/devstral-2512:free", label: "devstral (free)" },
  { value: "deepseek/deepseek-r1-0528:free", label: "deepseek-r1 (free)" },
];
