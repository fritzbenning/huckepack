"use node";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Read and interpolate a prompt template from a markdown file
 * @param dirPath - Directory containing the prompt.md file
 * @param filename - Name of the prompt file (default: "prompt.md")
 * @param variables - Variables to interpolate in the template
 * @returns Interpolated prompt text
 */
export async function readPromptTemplate(
  dirPath: string,
  filename: string = "prompt.md",
  variables: Record<string, unknown> = {}
): Promise<string> {
  const filePath = join(dirPath, filename);
  let template = await readFile(filePath, "utf-8");

  // Simple {{variable}} interpolation
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    template = template.replace(regex, String(value));
  }

  return template.trim();
}
