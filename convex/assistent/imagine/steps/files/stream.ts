export function cleanCodeContent(codeContent: string): string {
  let cleaned = codeContent.trim();

  // Remove markdown code blocks if present
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    if (lines[0].match(/^```(tsx?|jsx?)?$/)) {
      lines.shift();
    }
    if (lines.length > 0 && lines[lines.length - 1].trim() === "```") {
      lines.pop();
    }
    cleaned = lines.join("\n").trim();
  }

  return cleaned;
}
